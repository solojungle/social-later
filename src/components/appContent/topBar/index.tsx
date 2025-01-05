import { AddTeamMember } from "@/components/addTeamMember";
import { CreatePost } from "@/components/createPost";
import { FeedbackForm } from "@/components/feedbackButton";
import { NotificationCenter } from "@/components/notificationCenter";
import { SocialProfileSwitcher } from "@/components/socialProfileSwitcher";
import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSocialProfilesStore } from "@/stores/social-profiles";

export function TopBar({ toggleMenu }: { toggleMenu: () => void }) {
	const { currentProfileId: profileId } = useSocialProfilesStore();

	return (
		<div className="flex items-center justify-between border-b border-border p-3">
			<div className="flex items-center gap-2 sm:gap-x-6">
				<Button
					size="icon"
					variant="outline"
					onClick={toggleMenu}
					className="md:hidden"
				>
					<InterfaceIcons.Menu />
				</Button>
				<SocialProfileSwitcher />
				<AddTeamMember />
			</div>
			<div className="flex items-center space-x-2">
				<CreatePost profileId={profileId} scheduleDate={new Date()} />
				<FeedbackForm />
				<NotificationCenter />
			</div>
		</div>
	);
}
