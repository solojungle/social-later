resource "aws_api_gateway_rest_api" "transcribe_api" {
  name = "transcribe-api"
}

resource "aws_api_gateway_resource" "transcribe" {
  rest_api_id = aws_api_gateway_rest_api.transcribe_api.id
  parent_id   = aws_api_gateway_rest_api.transcribe_api.root_resource_id
  path_part   = "transcribe"
}

resource "aws_api_gateway_method" "transcribe_post" {
  rest_api_id   = aws_api_gateway_rest_api.transcribe_api.id
  resource_id   = aws_api_gateway_resource.transcribe.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "transcribe_post_response" {
  rest_api_id = aws_api_gateway_rest_api.transcribe_api.id
  resource_id = aws_api_gateway_resource.transcribe.id
  http_method = aws_api_gateway_method.transcribe_post.http_method
  status_code = "200"
}

resource "aws_api_gateway_method_response" "transcribe_post_error_response" {
  rest_api_id = aws_api_gateway_rest_api.transcribe_api.id
  resource_id = aws_api_gateway_resource.transcribe.id
  http_method = aws_api_gateway_method.transcribe_post.http_method
  status_code = "500"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.transcribe_api.id
  resource_id = aws_api_gateway_resource.transcribe.id
  http_method = aws_api_gateway_method.transcribe_post.http_method
  type        = "AWS_PROXY"
  uri         = aws_lambda_function.transcribe_media.invoke_arn
  integration_http_method = "POST"
}

resource "aws_api_gateway_integration_response" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.my_api.id
  resource_id = aws_api_gateway_resource.root.id
  http_method = aws_api_gateway_method.proxy.http_method
  status_code = aws_api_gateway_method_response.proxy.status_code

  depends_on = [
    aws_api_gateway_method.proxy,
    aws_api_gateway_integration.lambda_integration
  ]
}