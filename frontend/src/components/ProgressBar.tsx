import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, className }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Determine color based on percentage
  const getColorClass = () => {
    if (percentage >= 75) return 'bg-primary';
    if (percentage >= 50) return 'bg-secondary';
    if (percentage >= 25) return 'bg-accent';
    return 'bg-muted-foreground';
  };
  
  return (
    <div className={`h-2 w-full bg-muted rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full ${getColorClass()} rounded-full`}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
};

export default ProgressBar;
