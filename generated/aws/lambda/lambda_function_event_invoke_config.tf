resource "aws_lambda_function_event_invoke_config" "tfer--feic_arn-003A-aws-003A-lambda-003A-us-east-1-003A-654654550338-003A-function-003A-thumbnailCreator-003A--0024-LATEST" {
  function_name                = "arn:aws:lambda:us-east-1:654654550338:function:thumbnailCreator"
  maximum_event_age_in_seconds = "21600"
  maximum_retry_attempts       = "0"
}
