import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

export function TimePickerContent() {
  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");
  // const [ampm, setAmpm] = useState("AM");

  const handleHourChange = (e: any, action: any) => {
    let value = hours;
    if (action === "increment") {
      value =
        parseInt(value, 10) + 1 <= 12
          ? (parseInt(value, 10) + 1).toString().padStart(2, "0")
          : "01";
    } else if (action === "decrement") {
      value =
        parseInt(value, 10) - 1 >= 1
          ? (parseInt(value, 10) - 1).toString().padStart(2, "0")
          : "12";
    }
    setHours(value);
  };

  const handleMinuteChange = (e: any, action: any) => {
    let value = minutes;
    if (action === "increment") {
      value =
        parseInt(value, 10) + 1 <= 59
          ? (parseInt(value, 10) + 1).toString().padStart(2, "0")
          : "00";
    } else if (action === "decrement") {
      value =
        parseInt(value, 10) - 1 >= 0
          ? (parseInt(value, 10) - 1).toString().padStart(2, "0")
          : "59";
    }
    setMinutes(value);
  };

  const handleHourKeyDown = (e: any) => {
    if (e.key === "ArrowUp") {
      handleHourChange(e, "increment");
    } else if (e.key === "ArrowDown") {
      handleHourChange(e, "decrement");
    }
  };

  const handleMinuteKeyDown = (e: any) => {
    if (e.key === "ArrowUp") {
      handleMinuteChange(e, "increment");
    } else if (e.key === "ArrowDown") {
      handleMinuteChange(e, "decrement");
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 rounded-lg bg-card p-4">
      <div className="relative flex flex-col items-center space-y-1">
        <Button
          className="!w-full"
          onClick={(e) => handleHourChange(e, "increment")}
          size="icon"
          variant="ghost"
        >
          <ChevronUpIcon className="h-5 w-5" />
        </Button>
        <input
          className="h-16 w-16 appearance-none rounded-lg border border-border bg-transparent text-center font-mono text-3xl tabular-nums caret-transparent outline-none"
          maxLength={2}
          onChange={(e) => handleHourChange(e, "")}
          onKeyDown={handleHourKeyDown}
          type="text"
          value={hours}
        />
        <Button
          className="!w-full"
          onClick={(e) => handleHourChange(e, "decrement")}
          size="icon"
          variant="ghost"
        >
          <ChevronDownIcon className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center px-2">
        <span className="text-2xl text-muted-foreground">:</span>
      </div>
      <div className="relative flex flex-col items-center space-y-1">
        <Button
          className="!w-full"
          onClick={(e) => handleMinuteChange(e, "increment")}
          size="icon"
          variant="ghost"
        >
          <ChevronUpIcon className="h-5 w-5" />
        </Button>
        <input
          className="h-16 w-16 appearance-none rounded-lg border border-border bg-transparent text-center font-mono text-3xl tabular-nums caret-transparent outline-none"
          maxLength={2}
          onChange={(e) => handleMinuteChange(e, "")}
          onKeyDown={handleMinuteKeyDown}
          type="text"
          value={minutes}
        />
        <Button
          className="!w-full"
          onClick={(e) => handleMinuteChange(e, "decrement")}
          size="icon"
          variant="ghost"
        >
          <ChevronDownIcon className="h-5 w-5" />
        </Button>
      </div>
      <RadioGroup defaultValue="AM">
        <div className="flex items-center space-x-2">
          <RadioGroupItem id="AM" value="AM" />
          <Label htmlFor="AM">AM</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem id="PM" value="PM" />
          <Label htmlFor="PM">PM</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
