export function handleLinkClick({
	selectedAccountType,
	incomingAccountType,
	pathName,
	teamUrl,
	id,
}: {
	selectedAccountType: string;
	incomingAccountType: string;
	pathName: string;
	teamUrl: string;
	id?: string | string[] | undefined;
}) {
	if (selectedAccountType === "team") {
		// Clicks link from T -> T
		if (incomingAccountType === "team") {
			return pathName.replace(`/${id}`, `/${teamUrl}`);
		}

		// Clicks link from T -> P
		return pathName.replace(`/teams/${id}/`, "/");
	}

	// Clicks link from P -> T
	if (selectedAccountType === "personal" && incomingAccountType === "team") {
		if (pathName.includes("settings")) {
			return `/teams/${teamUrl}/${pathName}`;
		}
	}

	// Handle other cases or return default path if needed
	return pathName;
}
