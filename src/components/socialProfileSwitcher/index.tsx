"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { ProfileCards } from "../addSocialProfileButton";
import { InterfaceIcons } from "../ui/icons";

type ChannelIconProps = {
  type: string;
};

type CommandGroupProps = {
  setOpen: (open: boolean) => void;
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

// Types
type SocialProfile = {
  avatar: string;
  id: string;
  name?: null | string;
  teamId: string;
  type: string;
  username: string;
};

// Constants
const CHANNEL_ICONS: Record<string, string> = {
  linkedin: "/logos/linkedin_logo.webp",
  threads: "/logos/threads_logo.png",
  twitter: "/logos/twitter_logo.webp",
  youtube: "/logos/youtube_logo.webp",
};

// Helper functions
const getAvatarFallback = (profile: SocialProfile): string =>
  (profile.name && profile.name[0]?.toUpperCase()) ??
  profile.username[0]?.toUpperCase() ??
  "";

// Components
const ChannelServiceIcon: React.FC<ChannelIconProps> = ({ type }) => (
  <img
    alt={type}
    className="absolute bottom-0 right-0 m-px w-[14px] rounded-sm"
    src={CHANNEL_ICONS[type]}
  />
);

const ProfileAvatar: React.FC<{ profile: SocialProfile }> = ({ profile }) => (
  <Avatar className="relative mr-2 size-7 !rounded-sm">
    <ChannelServiceIcon type={profile.type} />
    <AvatarImage
      className="!rounded-sm border border-border bg-background"
      src={profile.avatar}
    />
    <AvatarFallback className="!rounded-sm border border-border">
      {getAvatarFallback(profile)}
    </AvatarFallback>
  </Avatar>
);

const SocialProfilesCommandGroup: React.FC<CommandGroupProps> = ({
  setOpen,
}) => {
  const { currentProfileId, profiles, setCurrentProfile } =
    useSocialProfilesStore();

  return (
    <CommandGroup heading="Profiles" key="profiles">
      {profiles.map((profile: SocialProfile) => (
        <CommandItem
          className="text-sm"
          key={profile.id}
          onSelect={() => {
            setCurrentProfile(profile);
            setOpen(false);
          }}
          value={profile.username}
        >
          <ProfileAvatar profile={profile} />
          <span
            className="overflow-hidden truncate"
            title={profile.name || profile.username}
          >
            {profile.name || profile.username}
          </span>
          <InterfaceIcons.Selected
            className={cn(
              "ml-auto h-4 w-4",
              currentProfileId === profile.id ? "opacity-100" : "opacity-0",
            )}
          />
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

const SocialProfileSwitcherPopoverTrigger: React.FC<
  { open: boolean } & PopoverTriggerProps
> = ({ className, open }) => {
  const { currentProfileId, profiles, setCurrentProfile } =
    useSocialProfilesStore();
  const selectedProfile = profiles.find(
    (profile) => profile.id === currentProfileId,
  );

  useEffect(() => {
    if (!selectedProfile && profiles.length > 0) {
      if (profiles[0]) {
        setCurrentProfile(profiles[0]);
      }
    }
  }, [selectedProfile, profiles, setCurrentProfile]);

  if (!selectedProfile) return null;

  return (
    <PopoverTrigger>
      <Button
        aria-expanded={open}
        aria-label="Select a profile"
        asChild
        className={cn("w-20 justify-between md:w-[250px]", className)}
        role="combobox"
        variant="outline"
      >
        <div>
          <ProfileAvatar profile={selectedProfile} />
          <span
            className="overflow-hidden truncate"
            title={selectedProfile.name || selectedProfile.username}
          >
            {selectedProfile.name || selectedProfile.username}
          </span>
          <CaretSortIcon className="ml-auto size-4 shrink-0 opacity-50" />
        </div>
      </Button>
    </PopoverTrigger>
  );
};

export const SocialProfileSwitcher: React.FC<PopoverTriggerProps> = ({
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [showNewProfileDialog, setShowNewProfileDialog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Dialog onOpenChange={setShowNewProfileDialog} open={showNewProfileDialog}>
      <Popover onOpenChange={setOpen} open={open}>
        <SocialProfileSwitcherPopoverTrigger
          className={className}
          open={open}
        />
        <PopoverContent align="start" className="w-[250px] p-0">
          <Command>
            <CommandInput placeholder="Search profiles..." />
            <CommandList>
              <CommandEmpty>No profiles found.</CommandEmpty>
              <SocialProfilesCommandGroup setOpen={setOpen} />
            </CommandList>
            <CommandList>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    setOpen(false);
                    setShowNewProfileDialog(true);
                  }}
                >
                  <PlusIcon className="mr-2 size-4" />
                  Add profile
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a social profile</DialogTitle>
          <DialogDescription>
            Connect your social profile to manage your posts.
          </DialogDescription>
        </DialogHeader>
        <ProfileCards />
      </DialogContent>
    </Dialog>
  );
};
