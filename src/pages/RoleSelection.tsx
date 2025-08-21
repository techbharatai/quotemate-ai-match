import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Building2, Hammer } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-lg text-muted-foreground">
            Select how you want to use QuoteMate
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Builder Option */}
          <Card className="card-shadow border-border/20 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm a Builder</CardTitle>
              <CardDescription className="text-base">
                Upload your subcontractor database and find matching trades
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="role"
                className="w-full"
                onClick={() => navigate("/builder")}
              >
                <div className="text-left">
                  <div className="font-semibold text-lg mb-2">Get Started as Builder</div>
                  {/*<div className="text-sm text-muted-foreground">
                    Import your database and discover top trades
                  </div>*/}
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Subcontractor Option */}
          <Card className="card-shadow border-border/20 hover:border-primary/50 transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm a Subcontractor</CardTitle>
              <CardDescription className="text-base">
                Register your details and see matching opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button 
                variant="role"
                className="w-full"
                onClick={() => navigate("/subcontractor")}
              >
                <div className="text-left">
                  <div className="font-semibold text-lg mb-2">Get Started as Subcontractor</div>
                  {/*<div className="text-sm text-muted-foreground">
                    Register and find matching trade opportunities
                  </div>*/}
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;