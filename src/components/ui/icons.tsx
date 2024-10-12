import { ArchiveIcon, BellIcon, CalendarIcon, DownloadIcon, HandshakeIcon, HomeIcon, InboxIcon, Loader2Icon, LogOutIcon, MailIcon, MenuIcon, PaperclipIcon, PieChartIcon, SettingsIcon, UserIcon } from "lucide-react"

type IconProps = React.HTMLAttributes<SVGElement>

export const InterfaceIcons = {
	Pages: {
		Nexus: HomeIcon,
		Analytics: PieChartIcon,
		Publish: CalendarIcon,
		Vault: ArchiveIcon,
	},
	LogoSmall: () => <img className="size-8 min-w-8" src="images/logo.png" alt="Logo Small" />,
	Socials: {
		YouTube: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
			<img {...props} src="/logos/youtube_logo.webp" alt="YouTube" />),
		Threads: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
			<img {...props} src="/logos/threads_logo.png" alt="Threads" />),
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
}



