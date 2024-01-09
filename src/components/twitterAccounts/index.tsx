"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

interface Props {
	teamId: string;
}

function List({ teamId }: Props) {
	const { data } = api.socials.getTwitterAccounts.useQuery({ id: teamId });

	if (!data) {
		return (
			<div>
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div>
			{data.map((account) => {
				return (
					<div key={account.id}>
						<p>{account.username}</p>
					</div>
				);
			})}
		</div>
	);
}

export function TwitterAccountsList() {
	const { id: teamId } = useSelectedTeamStore();

	if (!teamId) {
		return (
			<div>
				<p>Loading...</p>
			</div>
		);
	}

	return (
		<div>
			<h1>Twitter Accounts</h1>
			<List teamId={teamId} />
		</div>
	);
}
