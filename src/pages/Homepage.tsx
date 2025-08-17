import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2, Users, Zap } from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 hero-gradient" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo/Brand */}
            <div className="mb-8">
              <h1 className="text-6xl font-bold mb-4 bg-accent-gradient bg-clip-text text-transparent">
                QuoteMate
              </h1>
              <p className="text-xl text-muted-foreground">
                Smarter Tendering, Faster Quotes.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="card-shadow border-border/20">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Upload Database</h3>
                  <p className="text-sm text-muted-foreground">
                    Builders can upload their subcontractor database for instant access
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow border-border/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Register & Match</h3>
                  <p className="text-sm text-muted-foreground">
                    Subcontractors can register their details and see matching trades
                  </p>
                </CardContent>
              </Card>

              <Card className="card-shadow border-border/20">
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">AI-Powered Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    Smart matching of trades from preloaded EstimateOne dataset
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => navigate('/signin')}
              className="text-lg"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;