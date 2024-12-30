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
      <ToggleGroupItem value="day" className="font-mono hover:bg-primary/20 data-[state=on]:bg-primary/30">Day</ToggleGroupItem>
      <ToggleGroupItem value="week" className="font-mono hover:bg-primary/20 data-[state=on]:bg-primary/30">Week</ToggleGroupItem>
      <ToggleGroupItem value="month" className="font-mono hover:bg-primary/20 data-[state=on]:bg-primary/30">Month</ToggleGroupItem>
      <ToggleGroupItem value="year" className="font-mono hover:bg-primary/20 data-[state=on]:bg-primary/30">Year</ToggleGroupItem>
      <ToggleGroupItem value="all" className="font-mono hover:bg-primary/20 data-[state=on]:bg-primary/30">All time</ToggleGroupItem>
    </ToggleGroup>
  );
};