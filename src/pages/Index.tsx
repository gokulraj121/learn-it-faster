
import { Link } from "react-router-dom";
import { Brain, FileSymlink, PieChart, ArrowRight, CheckCircle, BadgeDollarSign, Users, Rocket } from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-background z-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-[30rem] h-[30rem] rounded-full bg-primary/10 filter blur-3xl opacity-20 animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 right-10 w-[25rem] h-[25rem] rounded-full bg-accent/10 filter blur-3xl opacity-20 animate-[pulse_10s_ease-in-out_infinite]" />
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-in">
            Transform Your Study Experience
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Toolkit provides powerful AI tools to help you study smarter, not harder. Convert, summarize, and visualize your learning materials with ease.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {!user ? (
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/flashcard-generator">
                <Button size="lg" className="gap-2">
                  Go to Tools
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to="/plans">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gradient">
            Powerful AI Tools for Students
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="glass-card p-8 flex flex-col items-start">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Flashcard Generator</h3>
              <p className="text-muted-foreground mb-6">
                Our AI analyzes your PDF documents and automatically extracts key concepts, creating perfect question-answer pairs for effective studying.
              </p>
              <ul className="space-y-3 mb-6 w-full">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Smart extraction of key concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Interactive flashcard interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Export to various formats</span>
                </li>
              </ul>
              <Link to="/flashcard-generator" className="mt-auto">
                <Button variant="outline" className="gap-2">
                  Try It Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-start">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <FileSymlink className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">File Converter</h3>
              <p className="text-muted-foreground mb-6">
                Quickly convert between different file formats with high accuracy and no loss of formatting or content quality.
              </p>
              <ul className="space-y-3 mb-6 w-full">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Convert PDFs to Word and vice versa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Image format conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>OCR for extracting text from images</span>
                </li>
              </ul>
              <Link to="/file-converter" className="mt-auto">
                <Button variant="outline" className="gap-2">
                  Try It Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="glass-card p-8 flex flex-col items-start">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <PieChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">PDF to Infographic</h3>
              <p className="text-muted-foreground mb-6">
                Transform dense text documents into visually appealing infographics that highlight the most important information and statistics.
              </p>
              <ul className="space-y-3 mb-6 w-full">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Automatic key point extraction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Multiple visualization styles</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Export as image or PDF</span>
                </li>
              </ul>
              <Link to="/pdf-to-infographic" className="mt-auto">
                <Button variant="outline" className="gap-2">
                  Try It Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-background z-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-[25rem] h-[25rem] rounded-full bg-primary/10 filter blur-3xl opacity-20 animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] rounded-full bg-accent/10 filter blur-3xl opacity-20 animate-[pulse_10s_ease-in-out_infinite]" />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gradient">
            Choose the Right Plan for You
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Get access to powerful AI tools with our flexible subscription plans
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Lite Plan */}
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Lite Plan</h3>
                  <p className="text-muted-foreground">Perfect for individual users</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$10</div>
                  <div className="text-sm text-muted-foreground">per month, billed yearly</div>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>50 AI Credits</strong> per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Support for <strong>100+ languages</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Custom watermark</strong> option</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Standard email support</span>
                </li>
              </ul>
              
              <Link to="/plans">
                <Button className="w-full">Choose Lite Plan</Button>
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-black/20 backdrop-blur-sm border border-primary/40 rounded-xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Pro Plan</h3>
                  <p className="text-muted-foreground">Best for teams and power users</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">$20</div>
                  <div className="text-sm text-muted-foreground">per month, billed yearly</div>
                </div>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>150 AI Credits</strong> per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Support for <strong>100+ languages</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Custom watermark</strong> option</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Add <strong>up to 5 users</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Rocket className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Priority email support</strong></span>
                </li>
              </ul>
              
              <Link to="/plans">
                <Button className="w-full bg-primary/90 hover:bg-primary">Choose Pro Plan</Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/plans">
              <Button variant="outline" size="lg">
                View All Plan Details
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-gradient">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Upload Your Document</h3>
              <p className="text-muted-foreground">
                Simply upload your PDF, Word document, or image to get started.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">AI Processing</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your content and performs the requested transformation.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Download Results</h3>
              <p className="text-muted-foreground">
                Get your flashcards, converted files, or infographics in seconds.
              </p>
            </div>
          </div>
          
          <div className="mt-16">
            {!user ? (
              <Link to="/auth">
                <Button size="lg">Start Using Toolkit Today</Button>
              </Link>
            ) : (
              <Link to="/flashcard-generator">
                <Button size="lg">Go to Your Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
      
      {/* Google Ads Section */}
      <div className="py-4 px-6 bg-black/40 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-xs text-muted-foreground">
          <p>Advertisement</p>
          <div className="h-20 bg-black/20 flex items-center justify-center rounded my-2 border border-white/5">
            <p>Google Ads will appear here</p>
          </div>
          <p>© {new Date().getFullYear()} Toolkit | All rights reserved</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
