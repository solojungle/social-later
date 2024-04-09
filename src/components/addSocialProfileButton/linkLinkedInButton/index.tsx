import { useRouter } from "next/navigation";

import { api } from "@/trpc/react";

export function LinkLinkedInButton({ teamId }: { teamId: string }) {
	const router = useRouter();

	const generateAuthLink = api.oauth2.generateLinkedinOAuth2URL.useQuery(
		undefined,
		{
			enabled: false,
		},
	);

	async function handleClick() {
		const { data } = await generateAuthLink.refetch();
		document.cookie = `teamId=${teamId}`;
		// Redirect to LinkedIn auth
		if (data?.url) {
			router.push(data.url);
		}
	}

	if (!teamId) {
		return null;
	}

	return (
		<button
			onClick={handleClick}
			type="button"
			className="flex select-none flex-col items-center justify-center rounded-lg border-2 border-border p-10 transition-colors duration-200 ease-in-out hover:bg-secondary"
		>
			<img
				src="https://logo.clearbit.com/linkedin.com"
				alt="Twitter logo"
				className="mb-2 h-8 w-8"
			/>
			<p className="font-medium">LinkedIn</p>
		</button>
	);
}
