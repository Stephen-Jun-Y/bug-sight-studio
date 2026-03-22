import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className = "" }: MobileLayoutProps) => {
  return (
    <div className={`relative flex h-dvh min-h-dvh w-full flex-col overflow-hidden bg-background ${className}`}>{children}</div>
  );
};

export default MobileLayout;
