data "archive_file" "lambda_zip" {
  type        = "zip"
  source_file  = "/Users/admin/Repos/social-management/bin/lambda/thumbnailCreator.mjs"
  output_path = "/Users/admin/Repos/social-management/bin/lambda/thumbnailCreator.zip"
}

resource "aws_lambda_function" "tfer--thumbnailCreator" {
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  architectures = ["x86_64"]

  ephemeral_storage {
    size = "512"
  }

  function_name = "thumbnailCreator"
  handler       = "index.handler"
  layers        = ["arn:aws:lambda:us-east-1:654654550338:layer:ffmpeg-layer:3", "arn:aws:lambda:us-east-1:654654550338:layer:sharp-v0-32:1"]

  logging_config {
    log_format = "Text"
    log_group  = "/aws/lambda/thumbnailCreator"
  }

  memory_size                    = "128"
  package_type                   = "Zip"
  reserved_concurrent_executions = "-1"
  role                           = "arn:aws:iam::654654550338:role/service-role/thumbnailCreator-role-d53hlsvt"
  runtime                        = "nodejs18.x"
  skip_destroy                   = "false"
  timeout                        = "30"

  tracing_config {
    mode = "PassThrough"
  }
}
