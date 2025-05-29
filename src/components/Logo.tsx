import React from 'react';
import { Presentation as FilePresentation } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`text-primary-600 ${className}`}>
      <FilePresentation size={32} strokeWidth={2} />
    </div>
  );
};

export default Logo;