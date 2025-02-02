import React from 'react';

interface ProgressBarProps {
  progress: number; // Progress percentage (0-100)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const radius = 20; // Radius of the circle
  const strokeWidth = 4; // Width of the stroke
  const normalizedRadius = radius - strokeWidth * 0.5; // Adjusted radius
  const circumference = normalizedRadius * 2 * Math.PI; // Circumference of the circle
  const strokeDashoffset = circumference - (progress / 100) * circumference; // Offset for the stroke

  return (
    <svg width={radius * 2} height={radius * 2} className="absolute right-0 mr-2">
      <circle
        stroke="#e6e6e6"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#3b82f6" // Tailwind blue-600
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={strokeDashoffset}
        style={{ transition: 'stroke-dashoffset 0.5s ease 0s' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        stroke="#3b82f6"
        strokeWidth="1px"
        dy=".3em"
        className="text-xs font-medium text-gray-700"
      >
        {progress}%
      </text>
    </svg>
  );
};

export default ProgressBar; 