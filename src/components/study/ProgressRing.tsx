import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { StatusType } from '@/types/study';

interface ProgressRingProps {
  percentage: number;
  status: StatusType;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export function ProgressRing({ 
  percentage, 
  status, 
  size = 200, 
  strokeWidth = 12,
  children 
}: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const statusColors = {
    success: 'stroke-success',
    warning: 'stroke-warning',
    danger: 'stroke-danger',
  };

  const statusGlows = {
    success: 'drop-shadow-[0_0_8px_hsl(var(--success)/0.5)]',
    warning: 'drop-shadow-[0_0_8px_hsl(var(--warning)/0.5)]',
    danger: 'drop-shadow-[0_0_8px_hsl(var(--danger)/0.5)]',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(
            statusColors[status],
            statusGlows[status],
            'transition-all duration-1000 ease-out'
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
