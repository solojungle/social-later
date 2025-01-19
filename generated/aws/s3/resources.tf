resource "aws_s3_bucket" "tfer--dev-socialmanagement-media" {
  bucket = "dev-socialmanagement-media"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = "0"
  }

  force_destroy = "false"

  grant {
    id          = "538701e3302a9d7b5f35c8c31c9eefc27464cecc3a5ce56669ffd89a6310f309"
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }

  object_lock_enabled = "false"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Effect": "Allow",
      "Principal": "*",
      "Resource": [
        "arn:aws:s3:::dev-socialmanagement-media/*",
        "arn:aws:s3:::dev-socialmanagement-media"
      ],
      "Sid": "PublicRead"
    }
  ],
  "Version": "2012-10-17"
}
POLICY

  request_payer = "BucketOwner"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }

      bucket_key_enabled = "true"
    }
  }

  versioning {
    enabled    = "false"
    mfa_delete = "false"
  }
}

resource "aws_s3_bucket" "tfer--dev-socialmanagement-media-thumbnails" {
  bucket = "dev-socialmanagement-media-thumbnails"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "POST", "PUT"]
    allowed_origins = ["*"]
    max_age_seconds = "0"
  }

  force_destroy = "false"

  grant {
    id          = "538701e3302a9d7b5f35c8c31c9eefc27464cecc3a5ce56669ffd89a6310f309"
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }

  object_lock_enabled = "false"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Effect": "Allow",
      "Principal": "*",
      "Resource": [
        "arn:aws:s3:::dev-socialmanagement-media-thumbnails/*",
        "arn:aws:s3:::dev-socialmanagement-media-thumbnails"
      ],
      "Sid": "PublicRead"
    }
  ],
  "Version": "2012-10-17"
}
POLICY

  request_payer = "BucketOwner"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }

      bucket_key_enabled = "true"
    }
  }

  versioning {
    enabled    = "false"
    mfa_delete = "false"
  }
}

resource "aws_s3_bucket" "tfer--prod-socialmanagement-media" {
  bucket = "prod-socialmanagement-media"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["DELETE", "GET", "HEAD", "POST", "PUT"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = "0"
  }

  force_destroy = "false"

  grant {
    id          = "538701e3302a9d7b5f35c8c31c9eefc27464cecc3a5ce56669ffd89a6310f309"
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }

  object_lock_enabled = "false"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion"
      ],
      "Effect": "Allow",
      "Principal": "*",
      "Resource": [
        "arn:aws:s3:::prod-socialmanagement-media/*",
        "arn:aws:s3:::prod-socialmanagement-media"
      ],
      "Sid": "PublicRead"
    }
  ],
  "Version": "2012-10-17"
}
POLICY

  request_payer = "BucketOwner"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }

      bucket_key_enabled = "true"
    }
  }

  versioning {
    enabled    = "false"
    mfa_delete = "false"
  }
}

resource "aws_s3_bucket" "tfer--prod-socialmanagement-media-thumbnails" {
  bucket = "prod-socialmanagement-media-thumbnails"

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["DELETE", "GET", "HEAD", "POST", "PUT"]
    allowed_origins = ["*"]
    max_age_seconds = "0"
  }

  force_destroy = "false"

  grant {
    id          = "538701e3302a9d7b5f35c8c31c9eefc27464cecc3a5ce56669ffd89a6310f309"
    permissions = ["FULL_CONTROL"]
    type        = "CanonicalUser"
  }

  object_lock_enabled = "false"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Effect": "Allow",
      "Principal": "*",
      "Resource": [
        "arn:aws:s3:::prod-socialmanagement-media-thumbnails/*",
        "arn:aws:s3:::prod-socialmanagement-media-thumbnails"
      ],
      "Sid": "PublicRead"
    }
  ],
  "Version": "2012-10-17"
}
POLICY

  request_payer = "BucketOwner"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }

      bucket_key_enabled = "true"
    }
  }

  versioning {
    enabled    = "false"
    mfa_delete = "false"
  }
}

resource "aws_s3_bucket_policy" "tfer--dev-socialmanagement-media" {
  bucket = "dev-socialmanagement-media"
  policy = "{\"Statement\":[{\"Action\":[\"s3:GetObject\",\"s3:GetObjectVersion\"],\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":[\"arn:aws:s3:::dev-socialmanagement-media/*\",\"arn:aws:s3:::dev-socialmanagement-media\"],\"Sid\":\"PublicRead\"}],\"Version\":\"2012-10-17\"}"
}

resource "aws_s3_bucket_policy" "tfer--dev-socialmanagement-media-thumbnails" {
  bucket = "dev-socialmanagement-media-thumbnails"
  policy = "{\"Statement\":[{\"Action\":[\"s3:GetObject\",\"s3:GetObjectVersion\",\"s3:PutObject\",\"s3:PutObjectAcl\"],\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":[\"arn:aws:s3:::dev-socialmanagement-media-thumbnails/*\",\"arn:aws:s3:::dev-socialmanagement-media-thumbnails\"],\"Sid\":\"PublicRead\"}],\"Version\":\"2012-10-17\"}"
}

resource "aws_s3_bucket_policy" "tfer--prod-socialmanagement-media" {
  bucket = "prod-socialmanagement-media"
  policy = "{\"Statement\":[{\"Action\":[\"s3:GetObject\",\"s3:GetObjectVersion\"],\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":[\"arn:aws:s3:::prod-socialmanagement-media/*\",\"arn:aws:s3:::prod-socialmanagement-media\"],\"Sid\":\"PublicRead\"}],\"Version\":\"2012-10-17\"}"
}

resource "aws_s3_bucket_policy" "tfer--prod-socialmanagement-media-thumbnails" {
  bucket = "prod-socialmanagement-media-thumbnails"
  policy = "{\"Statement\":[{\"Action\":[\"s3:GetObject\",\"s3:GetObjectVersion\",\"s3:PutObject\",\"s3:PutObjectAcl\"],\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":[\"arn:aws:s3:::prod-socialmanagement-media-thumbnails/*\",\"arn:aws:s3:::prod-socialmanagement-media-thumbnails\"],\"Sid\":\"PublicRead\"}],\"Version\":\"2012-10-17\"}"
}
