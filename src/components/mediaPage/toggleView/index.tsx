import { LayoutGridIcon, LucideIcon, Rows3Icon } from "lucide-react";
import { useState } from "react";

type BlockProps = {
  // eslint-disable-next-line react/no-unused-prop-types
  icon: LucideIcon;
  type: "grid" | "list";
  view: "grid" | "list";
};

type ToggleViewProps = {
  defaultView: "grid" | "list";
};

export function ToggleView({ defaultView }: ToggleViewProps) {
  const [view, setView] = useState<"grid" | "list">(defaultView);

  const handleToggle = () => {
    setView((prevView) => (prevView === "grid" ? "list" : "grid"));
  };

  return (
    <button
      aria-label="Toggle view"
      className="inline-flex shrink-0 cursor-pointer items-center space-x-px rounded-md border border-border bg-muted p-px text-muted-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      onClick={handleToggle}
      type="button"
    >
      <Block icon={LayoutGridIcon} type="grid" view={view} />
      <Block icon={Rows3Icon} type="list" view={view} />
    </button>
  );
}

function Block(props: BlockProps) {
  return (
    <div
      className={`flex h-8 w-8 items-center justify-center rounded-sm p-1 transition-colors ${
        props.view === props.type && "bg-background text-primary shadow-sm"
      }`}
    >
      <props.icon className="h-4" />
    </div>
  );
}
