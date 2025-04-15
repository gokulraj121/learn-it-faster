
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
}

export function FeatureCard({ icon, title, description, to }: FeatureCardProps) {
  return (
    <Link 
      to={to}
      className="feature-card group p-6 flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-5 pulse-glow">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="mt-auto flex items-center text-primary gap-1 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">
        <span>Try Now</span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
