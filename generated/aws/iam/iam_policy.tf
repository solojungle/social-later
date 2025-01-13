resource "aws_iam_policy" "tfer--AWSLambdaBasicExecutionRole-29baccd9-e629-49a8-856e-2d8f55dc874d" {
  name = "AWSLambdaBasicExecutionRole-29baccd9-e629-49a8-856e-2d8f55dc874d"
  path = "/service-role/"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": "logs:CreateLogGroup",
      "Effect": "Allow",
      "Resource": "arn:aws:logs:us-east-1:654654550338:*"
    },
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:logs:us-east-1:654654550338:log-group:/aws/lambda/ffmpeg:*"
      ]
    }
  ],
  "Version": "2012-10-17"
}
POLICY
}

resource "aws_iam_policy" "tfer--AWSLambdaBasicExecutionRole-aedbd3d2-1b5e-4e42-aec4-ca430f45a537" {
  name = "AWSLambdaBasicExecutionRole-aedbd3d2-1b5e-4e42-aec4-ca430f45a537"
  path = "/service-role/"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": "logs:CreateLogGroup",
      "Effect": "Allow",
      "Resource": "arn:aws:logs:us-east-1:654654550338:*"
    },
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:logs:us-east-1:654654550338:log-group:/aws/lambda/thumbnailCreator:*"
      ]
    }
  ],
  "Version": "2012-10-17"
}
POLICY
}

resource "aws_iam_policy" "tfer--AWSLambdaBasicExecutionRole-e19ff7d7-bf04-4ebc-a4c5-5711b90ae77d" {
  name = "AWSLambdaBasicExecutionRole-e19ff7d7-bf04-4ebc-a4c5-5711b90ae77d"
  path = "/service-role/"

  policy = <<POLICY
{
  "Statement": [
    {
      "Action": "logs:CreateLogGroup",
      "Effect": "Allow",
      "Resource": "arn:aws:logs:us-east-1:654654550338:*"
    },
    {
      "Action": [
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Effect": "Allow",
      "Resource": [
        "arn:aws:logs:us-east-1:654654550338:log-group:/aws/lambda/thumbnailCreator:*"
      ]
    }
  ],
  "Version": "2012-10-17"
}
POLICY
}
