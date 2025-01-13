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
