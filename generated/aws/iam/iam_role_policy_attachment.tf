resource "aws_iam_role_policy_attachment" "tfer--AWSServiceRoleForSupport_AWSSupportServiceRolePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/aws-service-role/AWSSupportServiceRolePolicy"
  role       = "AWSServiceRoleForSupport"
}

resource "aws_iam_role_policy_attachment" "tfer--AWSServiceRoleForTrustedAdvisor_AWSTrustedAdvisorServiceRolePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/aws-service-role/AWSTrustedAdvisorServiceRolePolicy"
  role       = "AWSServiceRoleForTrustedAdvisor"
}

resource "aws_iam_role_policy_attachment" "tfer--ffmpeg-role-ryrt6pal_AWSLambdaBasicExecutionRole-29baccd9-e629-49a8-856e-2d8f55dc874d" {
  policy_arn = "arn:aws:iam::654654550338:policy/service-role/AWSLambdaBasicExecutionRole-29baccd9-e629-49a8-856e-2d8f55dc874d"
  role       = "ffmpeg-role-ryrt6pal"
}

resource "aws_iam_role_policy_attachment" "tfer--thumbnailCreator-role-91s9nse5_AWSLambdaBasicExecutionRole-aedbd3d2-1b5e-4e42-aec4-ca430f45a537" {
  policy_arn = "arn:aws:iam::654654550338:policy/service-role/AWSLambdaBasicExecutionRole-aedbd3d2-1b5e-4e42-aec4-ca430f45a537"
  role       = "thumbnailCreator-role-91s9nse5"
}

resource "aws_iam_role_policy_attachment" "tfer--thumbnailCreator-role-d53hlsvt_AWSLambdaBasicExecutionRole-e19ff7d7-bf04-4ebc-a4c5-5711b90ae77d" {
  policy_arn = "arn:aws:iam::654654550338:policy/service-role/AWSLambdaBasicExecutionRole-e19ff7d7-bf04-4ebc-a4c5-5711b90ae77d"
  role       = "thumbnailCreator-role-d53hlsvt"
}
