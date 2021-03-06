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

variable "twilio_verify_service_sid" {}

variable "twilio_account_sid" {}

variable "twilio_account_token" {}

variable "twilio_message_service_sid" {}

variable "pending_ticket_num_to_notify" {}

variable "qdoc_portal_base_url" {}

variable "twilio_video_api_key_sid" {}

variable "twilio_video_api_secret" {}

variable "twilio_chat_service_sid" {}
