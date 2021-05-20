terraform {
  backend "gcs" {
    bucket      = "qdoc_staging_app_terraform_backend"
    prefix      = "staging_tf"
    credentials = "creds/keys.json"
  }
}

provider "google-beta" {
  project     = var.project_id
  region      = var.region
  zone        = var.zone
  credentials = file(var.gcp_auth_file)
}

resource "google_secret_manager_secret" "qdoc_staging_db_password" {
  provider = google-beta

  secret_id = "qdoc_staging_db_password"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "qdoc_staging_db_password_data" {
  provider = google-beta

  secret      = google_secret_manager_secret.qdoc_staging_db_password.secret_id
  secret_data = var.db_database
}

resource "google_secret_manager_secret_iam_member" "secret-access" {
  provider = google-beta

  secret_id  = google_secret_manager_secret.qdoc_staging_db_password.secret_id
  role       = "roles/secretmanager.secretAccessor"
  member     = "serviceAccount:${var.project_id}-compute@developer.gserviceaccount.com"
  depends_on = [google_secret_manager_secret.qdoc_staging_db_password]
}

resource "google_cloud_run_service" "qdoc" {
  provider = google-beta

  name     = "qdoc-${var.environment}"
  location = var.region

  autogenerate_revision_name = true
  depends_on                 = [google_secret_manager_secret_version.qdoc_staging_db_password_data]

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "1000"
        "run.googleapis.com/client-name"        = "terraform"
        "run.googleapis.com/cloudsql-instances" = "qdoc-309515:asia-southeast1:qdoc-postgres-staging"
      }
    }

    spec {
      containers {
        image = "asia.gcr.io/${var.project_id}/qdoc"
        env {
          name  = "NODE_ENV"
          value = var.environment
        }
        env {
          name  = "DB_HOST"
          value = var.db_host
        }
        env {
          name = "DB_DATABASE"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.qdoc_staging_db_password.secret_id
              key  = "1"
            }
          }
        }
        env {
          name  = "DB_PASSWORD"
          value = var.db_password
        }
        env {
          name  = "DB_USER"
          value = var.db_user
        }
        env {
          name  = "API_PORT"
          value = 8080
        }
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
    "allUsers"]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.qdoc.location
  project  = google_cloud_run_service.qdoc.project
  service  = google_cloud_run_service.qdoc.name

  policy_data = data.google_iam_policy.noauth.policy_data
}