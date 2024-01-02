/* eslint-disable indent */

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.text();
	console.log(body);
	return new Response("OK", {
		status: 200,
	});
}
