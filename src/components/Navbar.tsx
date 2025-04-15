
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { User, LogOut, BadgeDollarSign } from "lucide-react";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gradient">
          Toolkit
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/file-converter" className="text-sm text-muted-foreground hover:text-white transition-colors">
            File Converter
          </Link>
          
          <Link to="/flashcard-generator" className="text-sm text-muted-foreground hover:text-white transition-colors">
            Flashcard Generator
          </Link>
          
          <Link to="/pdf-to-infographic" className="text-sm text-muted-foreground hover:text-white transition-colors">
            PDF to Infographic
          </Link>
          
          <Link to="/plans" className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center gap-1">
            <BadgeDollarSign className="h-4 w-4" />
            Pricing
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/plans" className="w-full flex items-center">
                    <BadgeDollarSign className="mr-2 h-4 w-4" />
                    <span>Subscription Plans</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
