import { GeneralTeamForm } from "@/components/forms/general-form";
import { Separator } from "@/components/ui/separator";

export default function GeneralTeamSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General</h3>
        <p className="text-sm text-muted-foreground">
          Update your team&apos;s account settings. Set your avatar and other
          information.
        </p>
      </div>
      <Separator />
      <GeneralTeamForm />
    </div>
  );
}
