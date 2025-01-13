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
