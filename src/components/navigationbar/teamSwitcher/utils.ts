export function handleLinkClick({
  id,
  incomingAccountType,
  pathName,
  selectedAccountType,
  teamUrl,
}: {
  id?: string | string[] | undefined;
  incomingAccountType: string;
  pathName: string;
  selectedAccountType: string;
  teamUrl: string;
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
