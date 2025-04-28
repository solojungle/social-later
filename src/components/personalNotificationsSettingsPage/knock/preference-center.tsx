import { Checkbox } from "@/components/ui/checkbox";
import { useUserStore } from "@/stores/user";
import Knock, { PreferenceSet } from "@knocklabs/client";
import { useEffect, useState } from "react";

import { env } from "../../../env.mjs";

const PreferenceViewConfig = {
  ChannelTypeLabels: {
    email: "Email",
    in_app_feed: "In-app Feed",
    push: "Push",
  },
  RowSettings: {
    "file-upload": {
      description:
        "Get notified when a new file uploaded in workspaces you're a part of.",
      title: "File uploads",
    },
    "member-join": {
      description:
        "Get notified when someone joins a workspace you're a part of.",
      title: "Member joins",
    },
  },
};
type PreferenceViewLabels = "file-upload" | "member-join";
// type ChannelTypeLabels = "in_app_feed" | "email" | "push";

export function PreferenceCenter() {
  const { id: userId } = useUserStore();
  const knockClient = new Knock(env.NEXT_PUBLIC_KNOCK_KEY);
  knockClient.authenticate(userId);

  // Create some local state to store the user's preferences
  const [localPreferences, setLocalPreferences] = useState<PreferenceSet>({
    categories: {
      "file-upload": {
        channel_types: {
          email: false,
          in_app_feed: false,
        },
      },
      "member-join": {
        channel_types: {
          email: false,
          in_app_feed: false,
        },
      },
    },
    channel_types: {
      email: false,
      in_app_feed: false,
    },
    id: "default",
    workflows: {},
  } as PreferenceSet);

  // We load the current user's preferences from Knock, and set them to local preferences
  useEffect(() => {
    async function fetchPreferences() {
      const preferences = await knockClient.user.getPreferences();
      setLocalPreferences(preferences);
    }
    fetchPreferences();
  }, [knockClient.user]);

  function createPreferenceSet(
    preferenceType: string,
    preferenceKey: string,
    channelTypeSettings: Record<string, boolean>,
  ): PreferenceSet {
    // create a new preference set with local preferences as starting point
    const preferenceUpdate: PreferenceSet = {
      ...localPreferences,
    };

    if (
      preferenceType === "category" &&
      typeof preferenceUpdate.categories[preferenceKey] === "object"
    ) {
      preferenceUpdate.categories[preferenceKey] = {
        ...(preferenceUpdate.categories[preferenceKey] as object),
        channel_types: channelTypeSettings,
      };
    }

    if (
      preferenceType === "workflow" &&
      typeof preferenceUpdate.workflows[preferenceKey] === "object"
    ) {
      preferenceUpdate.workflows[preferenceKey] = {
        ...(preferenceUpdate.workflows[preferenceKey] as object),
        channel_types: channelTypeSettings,
      };
    }

    if (preferenceType === "channel_types") {
      preferenceUpdate.channel_types = channelTypeSettings;
    }

    return preferenceUpdate;
  }

  async function updatePreferences(update: PreferenceSet) {
    // Next, we upload the new PreferenceSet to Knock for that user
    const preferences = await knockClient.user.setPreferences(update);
    // Set the updated preferences in local state
    setLocalPreferences(preferences);
  }

  // When a preference setting is changed, we create a new PreferenceSet that
  // includes the change, update the preferences in Knock, and then update local state
  const onPreferenceChange = async ({
    channelTypeSettings,
    preferenceKey,
    preferenceType,
  }: {
    channelTypeSettings: Record<string, boolean>;
    preferenceKey: string;
    preferenceType: string;
  }) => {
    const preferenceUpdate = createPreferenceSet(
      preferenceType,
      preferenceKey,
      channelTypeSettings,
    );

    await updatePreferences(preferenceUpdate);
  };

  // If we haven't loaded preferences yet, maybe show a spinner
  if (!localPreferences) {
    return null;
  }

  return (
    <div className="space-y-6 rounded-xl border border-border p-6">
      <div className="flex justify-between">
        <h2 className="text-xs">Notification Type</h2>
        <div className="grid w-36 grid-cols-3 gap-2 text-xs">
          <span className="flex items-center justify-center">In-app</span>
          <span className="flex items-center justify-center">Email</span>
          <span className="flex items-center justify-center">Push</span>
        </div>
      </div>
      {Object.keys(localPreferences?.categories).map((category) => {
        const preferenceKey = category as PreferenceViewLabels;

        type CategoryPreference =
          | {
              channel_types: Record<string, boolean>;
            }
          | true;

        // Then in your component:
        if (typeof localPreferences?.categories[category] === "object") {
          const categoryPreference = localPreferences.categories[
            category
          ] as CategoryPreference;
          if (categoryPreference && typeof categoryPreference === "object") {
            const channelTypeSettings = categoryPreference.channel_types;
            return (
              <PreferenceSettingsRow
                channelTypeSettings={channelTypeSettings}
                key={category}
                onChange={onPreferenceChange}
                preferenceKey={preferenceKey}
                preferenceType="category"
              />
            );
          }
        }

        return null;
      })}
    </div>
  );
}

function PreferenceSettingsRow({
  channelTypeSettings,
  onChange,
  preferenceKey,
  preferenceType,
}: {
  channelTypeSettings: Record<string, boolean>;
  onChange: Function;
  preferenceKey: PreferenceViewLabels;
  preferenceType: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-4 last:border-b-0 last:pb-0">
      <div className="space-y-2">
        <h2 className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {PreferenceViewConfig.RowSettings[preferenceKey].title}
        </h2>
        <p className="text-[0.8rem] text-muted-foreground">
          {PreferenceViewConfig.RowSettings[preferenceKey].description}
        </p>
      </div>
      <div className="grid w-36 shrink-0 grid-cols-3 items-start gap-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {Object.keys(PreferenceViewConfig.ChannelTypeLabels).map(
          (channelType) => {
            return (
              <div
                className="flex items-center justify-center"
                key={`${preferenceKey}_${channelType}`}
              >
                <Checkbox
                  checked={channelTypeSettings[channelType]}
                  disabled={
                    typeof channelTypeSettings[channelType] === "undefined"
                  }
                  id={`${preferenceKey}_${channelType}`}
                  onCheckedChange={(checked) => {
                    onChange({
                      channelTypeSettings: {
                        ...channelTypeSettings,
                        [channelType]: checked,
                      },
                      preferenceKey,
                      preferenceType,
                    });
                  }}
                />
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
