
import { Link } from "react-router-dom";
import { Brain, FileSymlink, PieChart, BadgeDollarSign } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-24 relative overflow-hidden">
      <Navbar />
      
      {/* Background gradients */}
      <div className="absolute inset-0 bg-background z-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-[30rem] h-[30rem] rounded-full bg-primary/10 filter blur-3xl opacity-20 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 right-10 w-[25rem] h-[25rem] rounded-full bg-accent/10 filter blur-3xl opacity-20 animate-[pulse_10s_ease-in-out_infinite]" />
      </div>
      
      <div className="relative z-10 text-center mb-16 animate-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gradient">
          Toolkit
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Convert, Summarize & Study Smarter with AI
        </p>
        
        {!user && (
          <div className="mt-6">
            <Link to="/auth">
              <Button size="lg" className="animate-pulse">
                Sign Up to Access All Features
              </Button>
            </Link>
          </div>
        )}
        
        <div className="mt-4 flex justify-center gap-4">
          <Link to="/landing" className="text-sm text-primary hover:underline">
            Learn more about Toolkit
          </Link>
          <Link to="/plans" className="text-sm text-primary hover:underline flex items-center gap-1">
            <BadgeDollarSign className="h-4 w-4" />
            View Pricing Plans
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full relative z-10">
        <FeatureCard
          icon={<Brain className="h-9 w-9 text-primary" />}
          title="Flashcard Generator"
          description="Transform your PDF notes into interactive study flashcards. Extract key questions and answers automatically."
          to="/flashcard-generator"
          requiresAuth={true}
          isLoggedIn={!!user}
          isPremium={true}
        />
        
        <FeatureCard
          icon={<FileSymlink className="h-9 w-9 text-primary" />}
          title="File Converter"
          description="Convert between PDF, Word, images and text formats. Simple, fast and accurate file conversion."
          to="/file-converter"
          requiresAuth={false}
          isLoggedIn={!!user}
        />
        
        <FeatureCard
          icon={<PieChart className="h-9 w-9 text-primary" />}
          title="PDF to Infographic"
          description="Turn your PDFs into beautiful visual infographics. Highlight key information with stunning graphics."
          to="/pdf-to-infographic"
          requiresAuth={true}
          isLoggedIn={!!user}
          isPremium={true}
        />
      </div>
      
      <footer className="mt-auto pt-10 text-muted-foreground text-sm text-center relative z-10">
        <p>Toolkit © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Index;
