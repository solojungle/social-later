import { useRef, useState } from "react";

import { EmojiPicker } from "@/components/emojiPicker";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InterfaceIcons } from "@/components/ui/icons";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type StatusFormFieldProps = {
  form: any;
  maxCharCount?: number;
  valueName: string;
};

type ToolbarProps = {
  charCount: number;
  maxCharCount: number;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export function DescriptionFormField({
  form,
  maxCharCount = 200,
  valueName = "content",
}: StatusFormFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [charCount, setCharCount] = useState(0);

  const handleTextareaChange = () => {
    if (textareaRef.current) {
      setCharCount(textareaRef.current.value.length);
    }
  };

  return (
    <FormField
      control={form.control}
      name={valueName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex justify-between">
            <span>Description</span>
            <button className="text-xs text-blue-600" type="button">
              Add translation
            </button>
          </FormLabel>
          <FormControl>
            <div className="relative shadow-sm">
              <div className="relative rounded-lg border border-border">
                <Textarea
                  {...field}
                  autoFocus
                  className="h-48 border-b-[36px] border-transparent pb-0"
                  onInput={(e) => {
                    field.onChange(e);
                    handleTextareaChange();
                  }}
                  placeholder="Tell viewers about your video... (type @ to mention a channel)"
                  ref={textareaRef}
                />
                <div className="absolute inset-x-1 bottom-0">
                  <Toolbar
                    charCount={charCount}
                    maxCharCount={maxCharCount}
                    textareaRef={textareaRef}
                  />
                </div>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function Toolbar({ charCount, maxCharCount, textareaRef }: ToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex justify-start">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button size="icon" type="button" variant="ghost">
              <InterfaceIcons.Hyperlink className="size-5 text-muted-foreground" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span>Shorten link</span>
          </TooltipContent>
        </Tooltip>
        <EmojiPicker textareaRef={textareaRef} />
      </div>
      <span
        className={`text-xs ${
          charCount > maxCharCount ? "text-red-600" : "text-muted-foreground"
        }`}
      >
        {charCount}/{maxCharCount}
      </span>
    </div>
  );
}
