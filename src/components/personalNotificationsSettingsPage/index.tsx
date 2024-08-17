import { Separator } from "@/components/ui/separator";

import { PreferenceCenter } from "./knock/preference-center";

export default function PersonalNotificationsSettingsPage() {
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Notifications</h3>
				<p className="text-sm text-muted-foreground">
					Configure how you receive notifications.
				</p>
			</div>
			<Separator />
			<PreferenceCenter />
		</div>
	);
}
