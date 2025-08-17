import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Loader2, Zap } from "lucide-react";

const Processing = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to results after 3 seconds
    const timer = setTimeout(() => {
      navigate("/subcontractor-results");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="card-shadow border-border/20 w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
              <Zap className="w-8 h-8 text-primary" />
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Processing Your Information</h2>
            <p className="text-muted-foreground">
              Our AI is analyzing your profile and matching you with relevant trades from our database
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Analyzing your trade specialization...</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-accent-gradient h-2 rounded-full animate-pulse" style={{ width: "75%" }}></div>
            </div>

            <div className="text-xs text-muted-foreground">
              This usually takes 2-3 seconds
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Processing;