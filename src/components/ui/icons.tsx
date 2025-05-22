import {
  AlertTriangleIcon,
  ArchiveIcon,
  BellIcon,
  CalendarIcon,
  CaptionsIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  HandshakeIcon,
  HomeIcon,
  InboxIcon,
  ListStartIcon,
  Loader2Icon,
  LogOutIcon,
  MailIcon,
  MenuIcon,
  PaperclipIcon,
  PieChartIcon,
  PlusIcon,
  SettingsIcon,
  SparklesIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const InterfaceIcons = {
  Pages: {
    Nexus: HomeIcon,
    Analytics: PieChartIcon,
    Publish: CalendarIcon,
    Vault: ArchiveIcon,
    Creator: CaptionsIcon,
  },
  LogoSmall: () => (
    <img className="size-8 min-w-8" src="images/logo.png" alt="Logo Small" />
  ),
  Socials: {
    YouTube: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} src="/logos/youtube_logo.webp" alt="YouTube" />
    ),
    Threads: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} src="/logos/threads_logo.png" alt="Threads" />
    ),
    Twitter: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} src="/logos/twitter_logo.webp" alt="Twitter" />
    ),
    TikTok: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} src="/logos/tiktok_logo.png" alt="TikTok" />
    ),
    Instagram: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} src="/logos/instagram_logo.png" alt="Instagram" />
    ),
    Facebook: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} src="/logos/facebook_logo.png" alt="Facebook" />
    ),
    LinkedIn: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} src="/logos/linkedin_logo.png" alt="LinkedIn" />
    ),
  },
  Settings: SettingsIcon,
  Archive: ArchiveIcon,
  Inbox: InboxIcon,
  Loading: Loader2Icon,
  Notifications: BellIcon,
  Email: MailIcon,
  Attachments: PaperclipIcon,
  Joined: HandshakeIcon,
  Download: DownloadIcon,
  LogOut: LogOutIcon,
  PersonalSettings: UserIcon,
  Menu: MenuIcon,
  Render: ListStartIcon,
  Selected: CheckIcon,
  ArtificialIntelligence: SparklesIcon,
  Destructive: Trash2Icon,
  Next: ChevronRightIcon,
  Back: ChevronLeftIcon,
  Alert: AlertTriangleIcon,
  CreateOrAdd: PlusIcon,
};
