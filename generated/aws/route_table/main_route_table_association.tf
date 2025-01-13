resource "aws_main_route_table_association" "tfer--vpc-006fe2898f9ea459a" {
  route_table_id = "${data.terraform_remote_state.route_table.outputs.aws_route_table_tfer--rtb-0dfc6befbe03b4063_id}"
  vpc_id         = "${data.terraform_remote_state.vpc.outputs.aws_vpc_tfer--vpc-006fe2898f9ea459a_id}"
}
