import { SocialType } from "@prisma/client";

import { Progress } from "@/components/ui/progress";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { UpdatePlanButton } from "../cards/teams/team-plan";
import { formatSizeBytes } from "../mediaPage/allAssets";
import { InterfaceIcons } from "../ui/icons";

function Usage({
	used,
	formattedUsed,
	total,
	unit,
	label,
	Icon,
}: {
	used: number;
	formattedUsed?: string;
	total: number;
	unit: string;
	label: string;
	Icon: any;
}) {
	const progress = (used / total) * 100;
	return (
		<>
			<div className="mb-1.5 flex w-full flex-1 justify-between text-sm">
				<div className="flex items-center gap-2">
					<Icon className="size-4 shrink-0" />
					<span className="text-xs font-normal">{label}</span>
				</div>
				<span className="text-xs text-muted-foreground">
					{formattedUsed ?? used} / {total} {unit}
				</span>
			</div>
			<Progress value={progress} className="h-2 transition-all" />
		</>
	);
}

function UsageByPlatform({
	socialType,
	count,
}: {
	socialType: SocialType;
	count: number;
}) {
	const PLATFORM_CONFIG: Record<SocialType, any> = {
		youtube: {
			total: 5,
			label: "YouTube",
			Icon: InterfaceIcons.Socials.YouTube,
			unit: "Posts",
		},
		threads: {
			total: 250,
			label: "Threads",
			Icon: InterfaceIcons.Socials.Threads,
			unit: "Posts",
		},
		twitter: {
			total: 2400,
			label: "Twitter",
			Icon: InterfaceIcons.Socials.Twitter,
			unit: "Posts",
		},
		instagram: {
			total: 50,
			label: "Instagram",
			Icon: InterfaceIcons.Socials.Instagram,
			unit: "Posts",
		},
		facebook: {
			total: 35,
			label: "Facebook",
			Icon: InterfaceIcons.Socials.Facebook,
			unit: "Posts",
		},
		linkedin: {
			total: 10,
			label: "LinkedIn",
			Icon: InterfaceIcons.Socials.LinkedIn,
			unit: "Posts",
		},
		tiktok: { total: 15, label: "TikTok", Icon: InterfaceIcons.Socials.TikTok },
	};

	const config = PLATFORM_CONFIG[socialType as SocialType];

	if (!config) return null;

	return (
		<Usage
			used={count}
			total={config.total}
			unit={config.unit}
			label={config.label}
			Icon={config.Icon}
		/>
	);
}

export function PlanUsage() {
	const { id: teamId } = useSelectedTeamStore();

	const { data: usage, isLoading } = api.usage.find.useQuery(
		{ teamId },
		{
			enabled: !!teamId,
		},
	);

	if (isLoading || !usage) {
		return (
			<div className="flex h-72 flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const platforms = usage?.platforms ?? [];
	const totalSize = Number(
		((usage?.totalSize ?? 0) / 1024 / 1024 / 1024).toFixed(2),
	);
	const planUsage = usage?.usage ?? [];

	return (
		<>
			<h2 className="mb-4 text-sm font-medium">Daily Usage</h2>
			<div className="mb-6 space-y-2">
				{planUsage.length === 0 &&
					platforms.map((platform, index) => (
						<UsageByPlatform
							// eslint-disable-next-line react/no-array-index-key
							key={index}
							socialType={platform as SocialType}
							count={0}
						/>
					))}
				{planUsage.length > 0 &&
					planUsage.map((platform) => (
						<UsageByPlatform
							key={platform.socialType}
							socialType={platform.socialType}
							count={0 ?? 0}
						/>
					))}
			</div>
			<h2 className="mb-4 text-sm font-medium">Total Usage</h2>
			<div className="mb-6 space-y-2">
				<Usage
					used={totalSize}
					formattedUsed={formatSizeBytes(usage?.totalSize ?? 0)}
					total={100}
					unit="GB"
					label="Storage"
					Icon={InterfaceIcons.Archive}
				/>
			</div>
			<UpdatePlanButton
				className="mb-2 w-full"
				text="Change Plan"
				size="sm"
				variant="default"
			/>
			<span className="text-xs text-muted-foreground">
				Your plan renews on 12/12/2022
			</span>
		</>
	);
}
