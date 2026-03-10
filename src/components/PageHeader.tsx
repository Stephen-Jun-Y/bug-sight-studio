import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  right?: ReactNode;
  transparent?: boolean;
}

const PageHeader = ({ title, showBack = true, right, transparent = false }: PageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className={`flex items-center justify-between px-4 pt-14 pb-2 ${transparent ? "" : "bg-card"}`}>
      <div className="w-10">
        {showBack && (
          <button onClick={() => navigate(-1)} className="btn-tap min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2">
            <ChevronLeft size={28} className="text-primary" />
          </button>
        )}
      </div>
      <h1 className="text-subtitle text-foreground">{title}</h1>
      <div className="w-10 flex justify-end">{right}</div>
    </div>
  );
};

export default PageHeader;
