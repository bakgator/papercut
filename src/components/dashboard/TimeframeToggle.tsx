import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TimeframeToggleProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TimeframeToggle = ({ value, onValueChange }: TimeframeToggleProps) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(value) => value && onValueChange(value)} 
      className="justify-start space-x-2"
    >
      <ToggleGroupItem value="day" className="font-mono bg-white hover:bg-gray-50 data-[state=on]:bg-gray-100">Day</ToggleGroupItem>
      <ToggleGroupItem value="week" className="font-mono bg-white hover:bg-gray-50 data-[state=on]:bg-gray-100">Week</ToggleGroupItem>
      <ToggleGroupItem value="month" className="font-mono bg-white hover:bg-gray-50 data-[state=on]:bg-gray-100">Month</ToggleGroupItem>
      <ToggleGroupItem value="year" className="font-mono bg-white hover:bg-gray-50 data-[state=on]:bg-gray-100">Year</ToggleGroupItem>
      <ToggleGroupItem value="all" className="font-mono bg-white hover:bg-gray-50 data-[state=on]:bg-gray-100">All time</ToggleGroupItem>
    </ToggleGroup>
  );
};