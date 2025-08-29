import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Phone, Mail, MapPin, ArrowRight } from "lucide-react";

// Mock subcontractor data
const mockSubcontractors = [
  { id: 1, name: "ABC Plumbing", trade: "Plumbing", location: "Sydney", contact: "+61 2 9555 0123", email: "info@abcplumbing.com.au" },
  { id: 2, name: "Elite Electrical", trade: "Electrical", location: "Melbourne", contact: "+61 3 9555 0124", email: "contact@eliteelec.com.au" },
  { id: 3, name: "Sunshine Carpentry", trade: "Carpentry", location: "Brisbane", contact: "+61 7 3555 0125", email: "hello@sunshinecarp.com.au" },
  { id: 4, name: "Pro Painters", trade: "Painting", location: "Perth", contact: "+61 8 9555 0126", email: "quotes@propainters.com.au" },
  { id: 5, name: "Steel Masters", trade: "Steel Work", location: "Adelaide", contact: "+61 8 8555 0127", email: "sales@steelmasters.com.au" },
  { id: 6, name: "Precision HVAC", trade: "HVAC", location: "Sydney", contact: "+61 2 9555 0128", email: "info@precisionhvac.com.au" },
  { id: 7, name: "Urban Roofing", trade: "Roofing", location: "Melbourne", contact: "+61 3 9555 0129", email: "urban@roofing.com.au" },
  { id: 8, name: "Concrete Solutions", trade: "Concrete", location: "Brisbane", contact: "+61 7 3555 0130", email: "info@concretesolutions.com.au" },
];

const BuilderDashboard = () => {
  const [showTrades, setShowTrades] = useState(false);
  const navigate = useNavigate();

  const handleFindTrades = () => {
    setShowTrades(true);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/builder")}
            className="text-white bg-blue-600 hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Upload Database
          </Button>
          <div className="text-right">
            <h2 className="font-semibold">Welcome back!</h2>
            <p className="text-sm text-muted-foreground">Builder Dashboard</p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Builder Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your subcontractor database and find top trades
          </p>
          
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="card-shadow border-border/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Subcontractors</p>
                  <p className="text-3xl font-bold text-primary">47</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trade Categories</p>
                  <p className="text-3xl font-bold text-primary">12</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-border/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Locations</p>
                  <p className="text-3xl font-bold text-primary">5</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subcontractor Table */}
        <Card className="card-shadow border-border/20 mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Your Subcontractor Database</CardTitle>
              <CardDescription>
                Overview of your imported subcontractors
              </CardDescription>
            </div>
            <Button  
              size="lg"
              onClick={() => navigate("/upload")}
              className="flex justify-center bg-blue-600 hover:bg-blue-700 text-white" 
            >
              Create Variation Request
            </Button>
          </div>
        </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubcontractors.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.name}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                        {sub.trade}
                      </span>
                    </TableCell>
                    <TableCell>{sub.location}</TableCell>
                    <TableCell>{sub.contact}</TableCell>
                    <TableCell>{sub.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Find Trades Section */}
        <Card className="card-shadow border-border/20">
          <CardHeader>
            <CardTitle>Trade Matching</CardTitle>
            <CardDescription>
              Find top trades from EstimateOne dataset that match your subcontractors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showTrades ? (
              <div className="text-center py-8">
                <Button 
                  variant="hero"
                  size="lg"
                  onClick={handleFindTrades}
                >
                  Find Top Trades
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-green-500 mb-2">✓ Top 15 Matching Trades Found!</h3>
                  <p className="text-sm text-muted-foreground">
                    AI has matched trades from EstimateOne dataset with your subcontractor database
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    "Commercial Plumbing - Sydney CBD",
                    "High-rise Electrical - Melbourne",
                    "Custom Carpentry - Brisbane South",
                    "Industrial Painting - Perth Metro",
                    "Structural Steel - Adelaide Hills",
                    "Commercial HVAC - Sydney West",
                    "Metal Roofing - Melbourne East",
                    "Concrete Pumping - Brisbane North",
                    "Fire Protection - Perth City",
                    "Glazing Services - Adelaide CBD",
                    "Excavation - Sydney South",
                    "Scaffolding - Melbourne CBD",
                    "Tiling - Brisbane West",
                    "Insulation - Perth Hills",
                    "Waterproofing - Adelaide East"
                  ].map((trade, index) => (
                    <Card key={index} className="border-border/20 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{trade}</p>
                            <p className="text-xs text-muted-foreground">Match: {85 + index}%</p>
                          </div>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuilderDashboard;