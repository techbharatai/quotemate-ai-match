import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, MapPin, Calendar, DollarSign, Building } from "lucide-react";

// Mock trade opportunities data
const mockTrades = [
  {
    id: 1,
    title: "Commercial Plumbing - Sydney CBD Office Complex",
    location: "Sydney CBD, NSW",
    budget: "$45,000 - $65,000",
    deadline: "15 March 2024",
    company: "Urban Development Group",
    description: "Installation of complete plumbing system for 12-story office building",
    match: 98,
    urgency: "High"
  },
  {
    id: 2,
    title: "Residential Plumbing - Luxury Housing Project",
    location: "North Sydney, NSW",
    budget: "$25,000 - $35,000",
    deadline: "28 March 2024",
    company: "Premier Homes",
    description: "High-end residential plumbing for 8 luxury townhouses",
    match: 95,
    urgency: "Medium"
  },
  {
    id: 3,
    title: "Industrial Plumbing - Manufacturing Facility",
    location: "Western Sydney, NSW",
    budget: "$80,000 - $120,000",
    deadline: "10 April 2024",
    company: "Industrial Solutions Ltd",
    description: "Complex industrial plumbing system with specialized requirements",
    match: 92,
    urgency: "Low"
  },
  {
    id: 4,
    title: "Healthcare Plumbing - Hospital Extension",
    location: "Sydney South, NSW",
    budget: "$55,000 - $75,000",
    deadline: "5 April 2024",
    company: "Healthcare Infrastructure",
    description: "Medical-grade plumbing installation for hospital wing expansion",
    match: 90,
    urgency: "High"
  },
  {
    id: 5,
    title: "Retail Plumbing - Shopping Centre Renovation",
    location: "Parramatta, NSW",
    budget: "$35,000 - $50,000",
    deadline: "20 March 2024",
    company: "Retail Developments",
    description: "Plumbing upgrade for major shopping centre food court",
    match: 88,
    urgency: "Medium"
  },
  {
    id: 6,
    title: "Educational Plumbing - University Campus",
    location: "University of Sydney, NSW",
    budget: "$40,000 - $60,000",
    deadline: "2 April 2024",
    company: "Education Builders",
    description: "Plumbing installation for new student accommodation block",
    match: 85,
    urgency: "Medium"
  },
  {
    id: 7,
    title: "Hospitality Plumbing - Hotel Chain Project",
    location: "Sydney CBD, NSW",
    budget: "$65,000 - $85,000",
    deadline: "25 March 2024",
    company: "Hospitality Group",
    description: "Complete plumbing system for boutique hotel renovation",
    match: 83,
    urgency: "High"
  },
  {
    id: 8,
    title: "Mixed-Use Plumbing - Commercial & Residential",
    location: "Bondi Junction, NSW",
    budget: "$30,000 - $45,000",
    deadline: "8 April 2024",
    company: "Mixed Development Co",
    description: "Plumbing for mixed-use development with retail and apartments",
    match: 80,
    urgency: "Low"
  },
  {
    id: 9,
    title: "Sports Facility Plumbing - Aquatic Centre",
    location: "Olympic Park, NSW",
    budget: "$70,000 - $95,000",
    deadline: "15 April 2024",
    company: "Sports Infrastructure",
    description: "Specialized plumbing for Olympic-standard aquatic facility",
    match: 78,
    urgency: "Medium"
  },
  {
    id: 10,
    title: "Government Plumbing - Council Offices",
    location: "Sydney City, NSW",
    budget: "$20,000 - $30,000",
    deadline: "30 March 2024",
    company: "Sydney City Council",
    description: "Plumbing upgrade for government office building",
    match: 75,
    urgency: "Low"
  }
];

const SubcontractorResults = () => {
  const navigate = useNavigate();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Low": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/subcontractor")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Matching Complete</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="mb-8">
          <Card className="card-shadow border-green-500/20 bg-green-500/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-green-500 mb-2">Perfect Matches Found!</h2>
                  <p className="text-muted-foreground">
                    We found <span className="font-semibold text-foreground">10 high-quality trade opportunities</span> that match your plumbing specialization in Sydney
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Your Matching Trade Opportunities</h1>
          <p className="text-muted-foreground">
            Ranked by compatibility with your profile and experience
          </p>
        </div>

        {/* Trade Opportunities */}
        <div className="space-y-6">
          {mockTrades.map((trade) => (
            <Card key={trade.id} className="card-shadow border-border/20 hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{trade.title}</CardTitle>
                      <Badge className={`px-2 py-1 text-xs border ${getUrgencyColor(trade.urgency)}`}>
                        {trade.urgency} Priority
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {trade.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary mb-1">{trade.match}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{trade.company}</p>
                      <p className="text-xs text-muted-foreground">Client</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{trade.location}</p>
                      <p className="text-xs text-muted-foreground">Location</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{trade.budget}</p>
                      <p className="text-xs text-muted-foreground">Budget Range</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{trade.deadline}</p>
                      <p className="text-xs text-muted-foreground">Deadline</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Plumbing</Badge>
                    <Badge variant="secondary" className="text-xs">Commercial</Badge>
                    <Badge variant="secondary" className="text-xs">Sydney</Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/subcontractor")}>
              Update Profile
            </Button>
            <Button variant="hero">
              Apply to Selected Trades
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubcontractorResults;