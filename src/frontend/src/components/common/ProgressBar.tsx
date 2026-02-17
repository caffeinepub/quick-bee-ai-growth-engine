import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ value, max, label, showPercentage = true }: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label}</span>
          {showPercentage && <span className="font-medium">{percentage}%</span>}
        </div>
      )}
      <Progress value={percentage} className="h-2" />
      {!showPercentage && (
        <p className="text-xs text-muted-foreground">
          {value.toLocaleString()} / {max.toLocaleString()}
        </p>
      )}
    </div>
  );
}
