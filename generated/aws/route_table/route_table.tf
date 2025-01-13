resource "aws_route_table" "tfer--rtb-0dfc6befbe03b4063" {
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = "igw-0b8ec19f7ccf65e6d"
  }

  vpc_id = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-006fe2898f9ea459a_id}"
}
