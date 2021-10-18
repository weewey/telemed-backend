terraform {
  backend "gcs" {
    bucket      = "qdoc_staging_terraform_backend"
    prefix      = "staging_tf"
    credentials = "creds/keys.json"
  }
}

provider "google" {
  project     = var.project_id
  region      = var.region
  zone        = var.zone
  credentials = file(var.gcp_auth_file)
}

resource "google_cloud_run_service" "qdoc" {
  name     = "qdoc-${var.environment}"
  location = var.region

  autogenerate_revision_name = true

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/maxScale"      = "2"
        "autoscaling.knative.dev/minScale"      = "1"
        "run.googleapis.com/client-name"        = "terraform"
        "run.googleapis.com/cloudsql-instances" = "qdoc-309515:asia-southeast1:qdoc-postgres-staging"
      }
    }

    spec {
      containers {
        image = "asia.gcr.io/${var.project_id}/qdoc:${var.docker_image_tag}"
        env {
          name  = "NODE_ENV"
          value = var.environment
        }
        env {
          name  = "DB_HOST"
          value = var.db_host
        }
        env {
          name  = "DB_DATABASE"
          value = var.db_database
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
        env {
          name  = "ZOOM_API_KEY"
          value = var.zoom_api_key
        }
        env {
          name  = "ZOOM_API_SECRET"
          value = var.zoom_api_secret
        }
        env {
          name  = "ZOOM_BASE_URL"
          value = var.zoom_base_url
        }
        env {
          name  = "TWILIO_ACCOUNT_SID"
          value = var.twilio_account_sid
        }
        env {
          name  = "TWILIO_ACCOUNT_TOKEN"
          value = var.twilio_account_token
        }
        env {
          name  = "TWILIO_VERIFY_SERVICE_SID"
          value = var.twilio_verify_service_sid
        }
        env {
          name  = "TWILIO_MESSAGE_SERVICE_SID"
          value = var.twilio_message_service_sid
        }
        env {
          name  = "PENDING_TICKET_NUM_TO_NOTIFY"
          value = var.pending_ticket_num_to_notify
        }
        env {
          name  = "QDOC_PORTAL_BASE_URL"
          value = var.qdoc_portal_base_url
        }
        env {
          name  = "TWILIO_VIDEO_API_KEY_SID"
          value = var.twilio_video_api_key_sid
        }
        env {
          name  = "TWILIO_VIDEO_API_SECRET"
          value = var.twilio_video_api_secret
        }
        resources {
          limits = {
            cpu    = "2.0"
            memory = "1024Mi"
          }
        }
      }
    }
  }
}

data "google_iam_policy" "noauth" {
  binding {
    role    = "roles/run.invoker"
    members = [
      "allUsers"
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.qdoc.location
  project  = google_cloud_run_service.qdoc.project
  service  = google_cloud_run_service.qdoc.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
