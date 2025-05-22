import { Checkbox } from "@/components/ui/checkbox";
import { InterfaceIcons } from "@/components/ui/icons";

type Props = {
  folders: { count: number; id: number; name: string }[];
};

export function Folders({ folders }: Props) {
  return (
    <div>
      <h3 className="mb-4 font-medium">Folders</h3>
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        {folders.map((folder) => (
          <div
            className="flex items-center rounded-sm border border-border bg-background p-2 text-xs text-foreground shadow-sm"
            key={folder.id}
          >
            <Checkbox className="mr-4" />
            <InterfaceIcons.Directories className="mr-4 size-6" />
            <div>
              <div className="font-medium">{folder.name}</div>
              <div className="text-muted-foreground">{folder.count} assets</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
