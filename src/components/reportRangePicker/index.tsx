import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";

type ReportRangePickerProps = {
  onChange: (period: "annually" | "daily" | "monthly" | "weekly") => void;
  period: "annually" | "daily" | "monthly" | "weekly";
};

export function ReportRangePicker({
  onChange,
  period,
}: ReportRangePickerProps) {
  return (
    <Select defaultValue={period} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <CalendarIcon className="h-4 w-4" />
        <SelectValue placeholder="Select report range" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectItem value="daily">Daily</SelectItem> */}
          <SelectItem value="weekly">Weekly</SelectItem>
          <SelectItem value="monthly">Monthly</SelectItem>
          <SelectItem value="annually">Annually</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
