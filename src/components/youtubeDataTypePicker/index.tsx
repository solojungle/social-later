import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ReportRangePickerProps = {
  onChange: (type: "subscribers" | "views") => void;
  type: "subscribers" | "views";
};

export function DataTypePicker({ onChange, type }: ReportRangePickerProps) {
  return (
    <Select defaultValue={type} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select data type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="views">Views</SelectItem>
          <SelectItem value="subscribers">Subscribers</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
