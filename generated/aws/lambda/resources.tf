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

resource "aws_lambda_function_event_invoke_config" "tfer--feic_arn-003A-aws-003A-lambda-003A-us-east-1-003A-654654550338-003A-function-003A-thumbnailCreator-003A--0024-LATEST" {
  function_name                = "arn:aws:lambda:us-east-1:654654550338:function:thumbnailCreator"
  maximum_event_age_in_seconds = "21600"
  maximum_retry_attempts       = "0"
}

resource "aws_lambda_layer_version" "tfer--arn-003A-aws-003A-lambda-003A-us-east-1-003A-654654550338-003A-layer-003A-ffmpeg-layer-003A-1" {
  compatible_architectures = ["x86_64"]
  compatible_runtimes      = ["nodejs16.x", "nodejs18.x"]
  description              = "FFmpeg layer"
  layer_name               = "ffmpeg-layer"
  license_info             = "GPL v3"
}

resource "aws_lambda_layer_version" "tfer--arn-003A-aws-003A-lambda-003A-us-east-1-003A-654654550338-003A-layer-003A-ffmpeg-layer-003A-2" {
  compatible_architectures = ["x86_64"]
  compatible_runtimes      = ["nodejs16.x", "nodejs18.x"]
  description              = "FFmpeg layer"
  layer_name               = "ffmpeg-layer"
  license_info             = "GPL v3"
}

resource "aws_lambda_layer_version" "tfer--arn-003A-aws-003A-lambda-003A-us-east-1-003A-654654550338-003A-layer-003A-ffmpeg-layer-003A-3" {
  compatible_architectures = ["arm64"]
  layer_name               = "ffmpeg-layer"
}

resource "aws_lambda_layer_version" "tfer--arn-003A-aws-003A-lambda-003A-us-east-1-003A-654654550338-003A-layer-003A-sharp-v0-32-003A-1" {
  compatible_architectures = ["x86_64"]
  compatible_runtimes      = ["nodejs16.x", "nodejs18.x"]
  description              = "Sharp layer - v0.32 (Flow)"
  layer_name               = "sharp-v0-32"
  license_info             = "Apache License 2.0"
}

resource "aws_lambda_permission" "tfer--lambda-35f647cc-7ea3-407d-abba-f4c4973f179b" {
  action         = "lambda:InvokeFunction"
  function_name  = "arn:aws:lambda:us-east-1:654654550338:function:thumbnailCreator"
  principal      = "s3.amazonaws.com"
  source_account = "654654550338"
  source_arn     = "arn:aws:s3:::prod-socialmanagement-media"
  statement_id   = "lambda-35f647cc-7ea3-407d-abba-f4c4973f179b"
}

resource "aws_lambda_permission" "tfer--lambda-d4b1fefd-962a-4dee-a68a-b144ceedd340" {
  action         = "lambda:InvokeFunction"
  function_name  = "arn:aws:lambda:us-east-1:654654550338:function:thumbnailCreator"
  principal      = "s3.amazonaws.com"
  source_account = "654654550338"
  source_arn     = "arn:aws:s3:::dev-socialmanagement-media"
  statement_id   = "lambda-d4b1fefd-962a-4dee-a68a-b144ceedd340"
}
