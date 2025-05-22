import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const notifs = [
  {
    date: "Just now",
    id: 1,
    message:
      "Error message appears on page when updating / saving pages (no rhyme or reason to when it happens).",
    type: "error",
  },
  {
    date: "1d ago",
    id: 2,
    message:
      "Error message appears on page when updating / saving pages (no rhyme or reason to when it happens).",
    type: "error",
  },
  {
    date: "100d ago",
    id: 3,
    message:
      "Error message appears on page when updating / saving pages (no rhyme or reason to when it happens).",
    type: "error",
  },
  {
    date: "1y ago",
    id: 4,
    message:
      "Error message appears on page when updating / saving pages (no rhyme or reason to when it happens).",
    type: "error",
  },
];

interface NotificationContentProps extends React.HTMLAttributes<HTMLElement> {
  showDot?: boolean;
}

export function NotificationContent({
  className,
  ...props
}: NotificationContentProps) {
  return (
    <div className={cn("", className)} {...props}>
      <h2 className="font-medium tracking-tight">Inbox</h2>
      <Separator className="my-2" />
      <ScrollArea className="h-[500px] rounded-md">
        <ul className="space-y-4 divide-y divide-border">
          {notifs.map((e) => {
            return (
              <li className="flex items-start justify-center py-2" key={e.id}>
                <div>
                  <InterfaceIcons.Alert className="size-10" />
                </div>
                <div className="ml-3 flex flex-col text-xs">
                  <span className="mb-1">{e.message}</span>
                  <span className="text-muted-foreground">{e.date}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
      <Separator className="my-2" />
      <Button className="w-full" variant="ghost">
        Clear all
      </Button>
    </div>
  );
}
