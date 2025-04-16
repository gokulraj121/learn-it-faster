
import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  CheckCircle, 
  Users, 
  Award, 
  Clock, 
  Zap,
  Languages, 
  BadgeCheck, 
  Mail, 
  Rocket,
  Loader2
} from "lucide-react";

export default function Plans() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<{
    subscribed: boolean;
    subscription_tier: string | null;
    subscription_end: number | null;
  } | null>(null);
  
  const isLoggedIn = !!user;

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const response = await fetch('http://localhost:5000/api/check-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: user.id // This should be the Stripe customer ID in a real app
        })
      });
      
      if (!response.ok) throw new Error('Failed to check subscription');
      
      const data = await response.json();
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive"
      });
    }
  };
  
  const handleSubscribe = async (planId: string) => {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }
    
    setLoading(planId);
    
    try {
      const response = await fetch('http://localhost:5000/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId })
      });
      
      if (!response.ok) throw new Error('Failed to create checkout session');
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };
  
  const handleManageSubscription = async () => {
    if (!user) return;
    
    setLoading('manage');
    
    try {
      const response = await fetch('http://localhost:5000/api/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: user.id // This should be the Stripe customer ID in a real app
        })
      });
      
      if (!response.ok) throw new Error('Failed to create customer portal session');
      
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating customer portal session:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get access to AI-powered tools to enhance your learning and productivity
          </p>
          
          {subscription?.subscribed && (
            <div className="mt-4 inline-block px-4 py-2 bg-primary/10 rounded-full border border-primary/30">
              <p className="text-sm">
                You're currently on the <span className="font-bold text-primary">
                  {subscription.subscription_tier === 'lite' ? 'Lite' : 'Pro'} Plan
                </span>
                {subscription.subscription_end && (
                  <span> · Renews on {new Date(subscription.subscription_end * 1000).toLocaleDateString()}</span>
                )}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Lite Plan */}
          <div className={`flex flex-col ${subscription?.subscription_tier === 'lite' ? 'border-primary border-2' : 'border border-white/10'} rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm relative`}>
            {subscription?.subscription_tier === 'lite' && (
              <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-br-lg">
                CURRENT PLAN
              </div>
            )}
            
            <div className="bg-primary/10 p-6 text-center">
              <h2 className="text-2xl font-bold">Lite Plan</h2>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">$10</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground text-sm">Billed yearly ($120/year)</p>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>50 AI Credits</strong> per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Languages className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Supports <strong>100+ languages</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Custom watermark</strong> option for generated content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Standard email support</span>
                </li>
              </ul>
              
              {subscription?.subscription_tier === 'lite' ? (
                <Button 
                  size="lg" 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  disabled={loading === 'manage'}
                >
                  {loading === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage Subscription
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={() => handleSubscribe('lite')}
                  disabled={!!loading}
                >
                  {loading === 'lite' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoggedIn ? "Subscribe to Lite" : "Get Started with Lite"}
                </Button>
              )}
            </div>
          </div>
          
          {/* Pro Plan */}
          <div className={`flex flex-col ${subscription?.subscription_tier === 'pro' ? 'border-primary border-2' : 'border border-primary/40'} rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm relative`}>
            {subscription?.subscription_tier === 'pro' ? (
              <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-br-lg">
                CURRENT PLAN
              </div>
            ) : (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
            )}
            
            <div className="bg-primary/20 p-6 text-center">
              <h2 className="text-2xl font-bold">Pro Plan</h2>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">$20</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-muted-foreground text-sm">Billed yearly ($240/year)</p>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>150 AI Credits</strong> per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Languages className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Supports <strong>100+ languages</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Custom watermark</strong> option for generated content</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Add <strong>up to 5 users</strong> to the account</span>
                </li>
                <li className="flex items-start gap-2">
                  <Rocket className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>Priority email support</strong> with faster response times</span>
                </li>
              </ul>
              
              {subscription?.subscription_tier === 'pro' ? (
                <Button 
                  size="lg" 
                  className="w-full" 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  disabled={loading === 'manage'}
                >
                  {loading === 'manage' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage Subscription
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full bg-primary/90 hover:bg-primary"
                  onClick={() => handleSubscribe('pro')}
                  disabled={!!loading}
                >
                  {loading === 'pro' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isLoggedIn ? "Subscribe to Pro" : "Get Started with Pro"}
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">How Credits Work</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/10 backdrop-blur-sm border border-white/5 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Actions</h3>
              <p className="text-muted-foreground">Credits are used when you perform AI-powered actions like generating flashcards or creating infographics.</p>
            </div>
            
            <div className="bg-black/10 backdrop-blur-sm border border-white/5 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monthly Refresh</h3>
              <p className="text-muted-foreground">Your credits refresh every month, giving you a consistent allowance for your learning and productivity needs.</p>
            </div>
            
            <div className="bg-black/10 backdrop-blur-sm border border-white/5 rounded-xl p-6">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Credit Usage</h3>
              <p className="text-muted-foreground">Different actions require different amounts of credits. Complex operations like creating detailed infographics use more credits.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
