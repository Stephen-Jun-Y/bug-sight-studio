import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileLayout = ({ children, className = "" }: MobileLayoutProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/50 p-4">
      <div
        className={`relative w-[390px] h-[844px] bg-background rounded-[40px] overflow-hidden card-shadow-hover border border-border ${className}`}
        style={{ boxShadow: "0 0 0 8px #1a1a1a, 0 0 0 10px #333, 0 20px 60px rgba(0,0,0,0.3)" }}
      >
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 pt-3 pb-1">
          <span className="text-small font-semibold text-foreground">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px]">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-[3px] rounded-full bg-foreground" style={{ height: `${8 + i * 2}px` }} />
              ))}
            </div>
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" className="ml-1">
              <path d="M7.5 3.5C9.16 3.5 10.58 4.28 11.46 5.46L12.93 3.99C11.68 2.45 9.71 1.5 7.5 1.5C5.29 1.5 3.32 2.45 2.07 3.99L3.54 5.46C4.42 4.28 5.84 3.5 7.5 3.5Z" />
              <path d="M7.5 6.5C8.42 6.5 9.24 6.93 9.78 7.6L7.5 10L5.22 7.6C5.76 6.93 6.58 6.5 7.5 6.5Z" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="currentColor" className="ml-1">
              <rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
              <rect x="2" y="3" width="16" height="6" rx="1" fill="currentColor" />
              <rect x="22" y="4" width="2" height="4" rx="1" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
        </div>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[126px] h-[34px] bg-foreground rounded-b-[18px] z-50" />
        {/* Content */}
        <div className="h-full overflow-y-auto hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
