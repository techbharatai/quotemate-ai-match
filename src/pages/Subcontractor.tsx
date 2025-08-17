import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Building, MapPin, Phone, Mail } from "lucide-react";

const Subcontractor = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    trade: "",
    location: "",
    phone: "",
    email: "",
    experience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Mock form submission
    toast({
      title: "Registration Submitted!",
      description: "Processing your information...",
    });

    setTimeout(() => {
      navigate("/processing");
    }, 1000);
  };

  const isFormValid = formData.name && formData.company && formData.trade && formData.location && formData.email;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate("/role-selection")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Role Selection
          </Button>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Subcontractor Registration</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Subcontractor Registration</h1>
          <p className="text-lg text-muted-foreground">
            Register your details to find matching trade opportunities
          </p>
        </div>

        <Card className="card-shadow border-border/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Your Information
            </CardTitle>
            <CardDescription>
              Fill in your details to get matched with relevant trades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    placeholder="Smith Plumbing Pty Ltd"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Trade and Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trade">Trade/Specialization *</Label>
                  <Select value={formData.trade} onValueChange={(value) => handleInputChange("trade", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your trade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="carpentry">Carpentry</SelectItem>
                      <SelectItem value="painting">Painting</SelectItem>
                      <SelectItem value="roofing">Roofing</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="concrete">Concrete</SelectItem>
                      <SelectItem value="steel">Steel Work</SelectItem>
                      <SelectItem value="tiling">Tiling</SelectItem>
                      <SelectItem value="glazing">Glazing</SelectItem>
                      <SelectItem value="scaffolding">Scaffolding</SelectItem>
                      <SelectItem value="excavation">Excavation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sydney">Sydney, NSW</SelectItem>
                      <SelectItem value="melbourne">Melbourne, VIC</SelectItem>
                      <SelectItem value="brisbane">Brisbane, QLD</SelectItem>
                      <SelectItem value="perth">Perth, WA</SelectItem>
                      <SelectItem value="adelaide">Adelaide, SA</SelectItem>
                      <SelectItem value="canberra">Canberra, ACT</SelectItem>
                      <SelectItem value="darwin">Darwin, NT</SelectItem>
                      <SelectItem value="hobart">Hobart, TAS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+61 2 9555 0123"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@smithplumbing.com.au"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience & Specializations</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your experience, certifications, and any specializations..."
                  value={formData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                variant="hero"
                size="lg"
                className="w-full"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subcontractor;