export const handler = async (event, context) => {
	// Your Lambda function logic here

	const response = {
		statusCode: 200,

		headers: {
			"Content-Type": "application/json",
		},

		body: JSON.stringify({
			message: "Hello from Lambda!",
		}),
	};

	return response;
};
