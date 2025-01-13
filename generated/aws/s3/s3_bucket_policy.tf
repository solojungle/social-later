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
