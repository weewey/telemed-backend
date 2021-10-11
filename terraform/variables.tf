variable "environment" {
  default     = "staging"
  description = "Environment tag for resource group"
}

variable "region" {
  default = "asia-southeast1"
}

variable "project_id" {}

variable "zone" {
  default = "asia-southeast1-a"
}

variable "gcp_auth_file" {}

variable "db_host" {}

variable "db_database" {}

variable "db_password" {}

variable "cloud_sql_instance_name" {}

variable "db_user" {}

variable "docker_image_tag" {}

variable "zoom_api_key" {}

variable "zoom_api_secret" {}

variable "zoom_base_url" {}

variable "twilio_verify_service_sid" {}

variable "twilio_account_sid" {}

variable "twilio_account_token" {}

variable "twilio_message_service_sid" {}

