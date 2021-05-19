terraform {
  backend "gcs" {
    bucket = "qdoc_staging_app_terraform_backend"
    prefix = "staging_tf"
    credentials = "creds/keys.json"
  }
}

provider "google" {
  project = var.project_id
  region = var.region
  zone = var.zone
  credentials = file(var.gcp_auth_file)
}

resource "google_cloud_run_service" "qdoc" {
  name = "qdoc-${var.environment}"
  location = var.region

  metadata {
    annotations = {
      "run.googleapis.com/client-name" = "terraform"
      "run.googleapis.com/cloudsql-instances" = var.cloud_sql_instance_name
    }
  }

  template {
    spec {
      containers {
        image = "asia.gcr.io/${var.project_id}/qdoc"
        env {
          name = "NODE_ENV"
          value = var.environment
        }
        env {
          name = "DB_HOST"
          value = var.db_host
        }
        env {
          name = "DB_DATABASE"
          value = var.db_database
        }
        env {
          name = "DB_PASSWORD"
          value = var.db_password
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
  project = google_cloud_run_service.qdoc.project
  service = google_cloud_run_service.qdoc.name

  policy_data = data.google_iam_policy.noauth.policy_data
}