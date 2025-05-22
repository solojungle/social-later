import React, { useCallback } from "react";

export const Input: React.FC<{
  disabled?: boolean;
  setText: React.Dispatch<React.SetStateAction<string>>;
  text: string;
}> = ({ disabled, setText, text }) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setText(e.currentTarget.value);
    },
    [setText],
  );

  return (
    <input
      className="rounded-geist p-geist-half border-unfocused-border-color focus:border-focused-border-color block w-full border bg-background text-sm leading-[1.7] text-foreground outline-none transition-colors duration-150 ease-in-out"
      disabled={disabled}
      name="title"
      onChange={onChange}
      value={text}
    />
  );
};
