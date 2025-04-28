import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Replace with @shadcn/ui components if using shadcnui
// Icon library of choice
import React from "react";
// Your utility for conditional classNames

const languages = [
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "fr", flag: "🇫🇷", name: "French" },
  { code: "es", flag: "🇪🇸", name: "Spanish" },
  { code: "de", flag: "🇩🇪", name: "German" },
];

export const LanguageSelector = () => {
  // const [selectedLanguage, setSelectedLanguage] = React.useState(
  // 	languages[0] ?? {
  // 		code: "en",
  // 		name: "English",
  // 		flag: "🇺🇸",
  // 	},
  // );

  // const handleLanguageChange = (lang: (typeof languages)[0]) => {
  // 	setSelectedLanguage(lang);
  // 	// Add logic to update app's language settings
  // };

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
