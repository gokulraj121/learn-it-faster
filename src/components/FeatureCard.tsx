
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, BadgeDollarSign } from "lucide-react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  to: string;
  requiresAuth?: boolean;
  isLoggedIn?: boolean;
  isPremium?: boolean;
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  to, 
  requiresAuth = false,
  isLoggedIn = false,
  isPremium = false
}: FeatureCardProps) {
  const linkTo = requiresAuth && !isLoggedIn ? "/auth" : to;
  
  return (
    <Link 
      to={linkTo}
      className="feature-card group p-6 flex flex-col items-center text-center relative overflow-hidden bg-black/10 backdrop-blur-sm rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-primary/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {isPremium && (
        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
          PREMIUM
        </div>
      )}
      
      <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-5 pulse-glow relative z-10 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
        {title}
        {requiresAuth && !isLoggedIn && (
          <Lock className="inline-block ml-2 h-4 w-4 text-muted-foreground" />
        )}
        {isPremium && (
          <BadgeDollarSign className="inline-block ml-2 h-4 w-4 text-primary" />
        )}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-5 relative z-10 group-hover:text-foreground/90 transition-colors duration-300">
        {description}
      </p>
      
      <div className="mt-auto flex items-center text-primary gap-1 text-sm font-medium opacity-80 group-hover:opacity-100 transition-all duration-300 relative z-10 group-hover:translate-x-1">
        <span>
          {requiresAuth && !isLoggedIn ? "Sign In to Access" : 
           isPremium && isLoggedIn ? "Use Premium Feature" : 
           isPremium && !isLoggedIn ? "Upgrade to Access" : "Try Now"}
        </span>
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </Link>
  );
}
