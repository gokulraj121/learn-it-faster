
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PaymentSuccess() {
  useEffect(() => {
    // If analytics is needed, you would add it here
    // analytics.track('payment_success');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-3xl mx-auto px-6 py-16 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Payment Successful!</h1>
        
        <p className="text-lg text-muted-foreground text-center mb-8">
          Thank you for your subscription. Your account has been successfully upgraded.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full">
              Return to Dashboard
            </Button>
          </Link>
          
          <Link to="/flashcard-generator">
            <Button size="lg" className="w-full">
              Try Premium Features
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
