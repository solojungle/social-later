resource "aws_lambda_function" "tfer--thumbnailCreator" {
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
