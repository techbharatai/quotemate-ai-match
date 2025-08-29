import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Upload, ArrowLeft, FileText, ArrowRight } from "lucide-react";

const Builder = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = () => {
    setIsUploading(true);
    
    // Mock file upload with delay
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
      toast({
        title: "Database Uploaded Successfully!",
        description: "Your subcontractor database has been processed.",
      });
    }, 2000);
  };

  const handleProceedToDashboard = () => {
    navigate("/builder-dashboard");
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            size="sm"
            onClick={() => navigate("/upload")}
            className="text-white hover:text-foreground"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
             To Variation Request Page
          </Button>
          


          
          <Button 
            size="sm"
            onClick={() => navigate("/builder-dashboard")}
            className="text-white hover:text-foreground"
          >
            Builder Dashboard
          </Button>
          
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Builder Portal</h1>
          <p className="text-lg text-muted-foreground">
            Import your subcontractor database to get started
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!isUploaded ? (
            <Card className="card-shadow border-border/20">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Import Your Database</CardTitle>
                <CardDescription className="text-base">
                  Upload your subcontractor database to start matching with trades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Select your CSV or Excel file here, or click to browse
                  </p>
                  <Button 
                    variant="outline"
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="mx-auto"
                  >
                    {isUploading ? "Uploading..." : "Choose File"}
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Supported formats: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-shadow">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-green-500" />
                </div>
                <CardTitle className="text-2xl text-green-500">Database Uploaded!</CardTitle>
                <CardDescription className="text-base">
                  Your subcontractor database has been successfully processed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Upload Summary:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 47 subcontractors imported</li>
                    <li>• 12 different trade categories</li>
                    <li>• 5 locations covered</li>
                  </ul>
                </div>
                <Button 
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleProceedToDashboard}
                >
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Builder;