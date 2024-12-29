import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@radix-ui/react-popover"; // Replace with @shadcn/ui components if using shadcnui
import { ChevronDown } from "lucide-react"; // Icon library of choice
import React from "react";

import { cn } from "@/lib/utils"; // Your utility for conditional classNames
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const languages = [
	{ code: "en", name: "English", flag: "🇺🇸" },
	{ code: "fr", name: "French", flag: "🇫🇷" },
	{ code: "es", name: "Spanish", flag: "🇪🇸" },
	{ code: "de", name: "German", flag: "🇩🇪" },
];

export const LanguageSelector = () => {
	const [selectedLanguage, setSelectedLanguage] = React.useState(
		languages[0] ?? {
			code: "en",
			name: "English",
			flag: "🇺🇸",
		},
	);

	const handleLanguageChange = (lang: (typeof languages)[0]) => {
		setSelectedLanguage(lang);
		// Add logic to update app's language settings
	};

	return (
		<Select defaultValue="en">
			<SelectTrigger>
				<SelectValue placeholder="Select language" />
			</SelectTrigger>
			<SelectContent>
				{languages.map((lang) => (
					<SelectItem key={lang.code} value={lang.code}>
						{lang.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
