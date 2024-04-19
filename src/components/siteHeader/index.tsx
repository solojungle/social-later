import { StoreInitializer } from "../storeInitializer";

interface SiteHeaderProps {
	userData: any;
	teamsData: any;
	socialProfilesData: any;
	teamMembersData: any;
}

export function SiteHeader({
	userData,
	teamsData,
	socialProfilesData,
	teamMembersData,
}: SiteHeaderProps) {
	return (
		<StoreInitializer
			user={{ ...userData }}
			teams={teamsData || []}
			profiles={socialProfilesData || []}
			members={teamMembersData || []}
		/>
	);
}
