import { Progress } from "@/components/ui/progress";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";
import { SocialType } from "@prisma/client";

import { UpdatePlanButton } from "../cards/teams/team-plan";
import { formatSizeBytes } from "../mediaPage/allAssets";
import { InterfaceIcons } from "../ui/icons";

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
              count={0}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              socialType={platform as SocialType}
            />
          ))}
        {planUsage.length > 0 &&
          planUsage.map((platform) => (
            <UsageByPlatform
              count={0 ?? 0}
              key={platform.socialType}
              socialType={platform.socialType}
            />
          ))}
      </div>
      <h2 className="mb-4 text-sm font-medium">Total Usage</h2>
      <div className="mb-6 space-y-2">
        <Usage
          formattedUsed={formatSizeBytes(usage?.totalSize ?? 0)}
          Icon={InterfaceIcons.Archive}
          label="Storage"
          total={100}
          unit="GB"
          used={totalSize}
        />
      </div>
      <UpdatePlanButton
        className="mb-2 w-full"
        size="sm"
        text="Change Plan"
        variant="default"
      />
      <span className="text-xs text-muted-foreground">
        Your plan renews on 12/12/2022
      </span>
    </>
  );
}

function Usage({
  formattedUsed,
  Icon,
  label,
  total,
  unit,
  used,
}: {
  formattedUsed?: string;
  Icon: any;
  label: string;
  total: number;
  unit: string;
  used: number;
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
      <Progress className="h-2 transition-all" value={progress} />
    </>
  );
}

function UsageByPlatform({
  count,
  socialType,
}: {
  count: number;
  socialType: SocialType;
}) {
  const PLATFORM_CONFIG: Record<SocialType, any> = {
    facebook: {
      Icon: InterfaceIcons.Socials.Facebook,
      label: "Facebook",
      total: 35,
      unit: "Posts",
    },
    instagram: {
      Icon: InterfaceIcons.Socials.Instagram,
      label: "Instagram",
      total: 50,
      unit: "Posts",
    },
    linkedin: {
      Icon: InterfaceIcons.Socials.LinkedIn,
      label: "LinkedIn",
      total: 10,
      unit: "Posts",
    },
    threads: {
      Icon: InterfaceIcons.Socials.Threads,
      label: "Threads",
      total: 250,
      unit: "Posts",
    },
    tiktok: { Icon: InterfaceIcons.Socials.TikTok, label: "TikTok", total: 15 },
    twitter: {
      Icon: InterfaceIcons.Socials.Twitter,
      label: "Twitter",
      total: 2400,
      unit: "Posts",
    },
    youtube: {
      Icon: InterfaceIcons.Socials.YouTube,
      label: "YouTube",
      total: 5,
      unit: "Posts",
    },
  };

  const config = PLATFORM_CONFIG[socialType as SocialType];

  if (!config) return null;

  return (
    <Usage
      Icon={config.Icon}
      label={config.label}
      total={config.total}
      unit={config.unit}
      used={count}
    />
  );
}
