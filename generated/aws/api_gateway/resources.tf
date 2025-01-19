resource "aws_api_gateway_method" "tfer--rql8ze72jf-002F-c3d4ek-002F-POST" {
  api_key_required = "false"
  authorization    = "NONE"
  http_method      = "POST"
  resource_id      = "c3d4ek"
  rest_api_id      = "rql8ze72jf"
}

resource "aws_api_gateway_method_response" "tfer--rql8ze72jf-002F-c3d4ek-002F-POST-002F-200" {
  http_method = "POST"
  resource_id = "c3d4ek"
  rest_api_id = "rql8ze72jf"
  status_code = "200"
}

resource "aws_api_gateway_method_response" "tfer--rql8ze72jf-002F-c3d4ek-002F-POST-002F-500" {
  http_method = "POST"
  resource_id = "c3d4ek"
  rest_api_id = "rql8ze72jf"
  status_code = "500"
}

resource "aws_api_gateway_model" "tfer--rql8ze72jf-002F-a47yaz" {
  content_type = "application/json"
  description  = "This is a default empty schema model"
  name         = "Empty"
  rest_api_id  = "rql8ze72jf"
  schema       = "{\n  \"$schema\": \"http://json-schema.org/draft-04/schema#\",\n  \"title\" : \"Empty Schema\",\n  \"type\" : \"object\"\n}"
}

resource "aws_api_gateway_model" "tfer--rql8ze72jf-002F-znvqrw" {
  content_type = "application/json"
  description  = "This is a default error schema model"
  name         = "Error"
  rest_api_id  = "rql8ze72jf"
  schema       = "{\n  \"$schema\" : \"http://json-schema.org/draft-04/schema#\",\n  \"title\" : \"Error Schema\",\n  \"type\" : \"object\",\n  \"properties\" : {\n    \"message\" : { \"type\" : \"string\" }\n  }\n}"
}

resource "aws_api_gateway_rest_api" "tfer--rql8ze72jf_transcribe-api" {
  api_key_source               = "HEADER"
  disable_execute_api_endpoint = "false"

  endpoint_configuration {
    types = ["EDGE"]
  }

  name = "transcribe-api"
}
