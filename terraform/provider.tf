terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1" # Set your preferred AWS region
}


data "aws_availability_zones" "available" {
  state = "available"
}