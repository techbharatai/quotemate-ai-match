import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, User, Building, MapPin, Phone, Mail, Loader2, ChevronDown } from "lucide-react";
import { API_BASE_URL } from "@/config/constants";

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
  const [showTradeDropdown, setShowTradeDropdown] = useState(false);
  const [filteredTrades, setFilteredTrades] = useState<string[]>([]);
  const tradeInputRef = useRef<HTMLInputElement>(null);
  const tradeDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const predefinedTrades = [
    "Access Control", "Access Floors", "Acoustic Products", "Air Grilles / Louvres", "Aluminium Windows", "Asbestos", "Asphalt Roads & Driveways", "Audiovisual", 
    "Balustrading", "Blinds & Curtains", "Bricklayers & Blocklayers", "Building Cleaners", "Carpentry", "Carpet & Vinyl", "Caulking", "CCTV", "Ceilings", 
    "Civil Works", "Communications", "Concrete", "Concrete Cutting", "Concrete Polishing", "Concrete Post-Tension", "Concrete Repair", "Coolrooms", "Cranes", 
    "Demolition", "Doors & Frames", "Double Glazing", "Earthworks", "Electrical", "Epoxy Floor Coatings", "Facade Construction", "Fencing", "Fire Safety", 
    "Floor Heating", "Formwork", "Furniture (Commercial)", "Glazed Balustrades", "Glazed Partitions", "Glaziers", "Hardware", "Hydraulic", "Insulation", 
    "Intercoms", "Joinery", "Landscaping", "Lift", "Light Steel Framing", "Linemarking", "Marble / Granite", "Mechanical", "Metalwork", "Nurse Call", 
    "Operable Walls", "Painting", "Partitions", "Passive Fire Protection", "Paving", "Pest Control", "Piling", "Pinboards & Whiteboards", "Plasterboard", 
    "Precast Concrete", "Reinforcement", "Reinforcement Supply", "Relocation", "Resilient Flooring", "Retention Systems", "Roller Doors", "Roof Safety", "Roof Tiling", 
    "Roofing", "Sanitary Hardware", "Scaffold/ Gantry/ Shoring", "Security", "Security Screens", "Shade/Umbrella/Awnings", "Sheds", "Shotcrete", "Signs / Displays", 
    "Skylights", "Solar Panels", "Solid Plaster / Render", "Specialist Cladding", "Sports Surfacing & Equipment", "Stainless Steel", "Stairs", "Street Furniture", 
    "Structural Steel", "Surveying", "Swimming Pools", "Tactile Indicators", "Tanking", "Tiling", "Timber Flooring", "Timber Supply", "Timber Trusses", "Timber Windows", 
    "Toilet Partitions", "Water Tanks", "Whitegoods", "Window Film", "Workstations"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tradeDropdownRef.current &&
        !tradeDropdownRef.current.contains(event.target as Node) &&
        tradeInputRef.current &&
        !tradeInputRef.current.contains(event.target as Node)
      ) {
        setShowTradeDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTradeInputChange = (value: string) => {
    handleInputChange("trade", value);
    
    // Filter trades based on input
    const filtered = predefinedTrades.filter(trade =>
      trade.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTrades(filtered);
    
    if (value.length > 0 && filtered.length > 0) {
      setShowTradeDropdown(true);
    } else if (value.length === 0) {
      setFilteredTrades(predefinedTrades);
    }
  };

  const handleTradeInputFocus = () => {
    setFilteredTrades(predefinedTrades);
    setShowTradeDropdown(true);
  };

  const handleTradeSelect = (trade: string) => {
    handleInputChange("trade", trade);
    setShowTradeDropdown(false);
    tradeInputRef.current?.blur();
  };

  const handleTradeDropdownToggle = () => {
    if (showTradeDropdown) {
      setShowTradeDropdown(false);
    } else {
      setFilteredTrades(predefinedTrades);
      setShowTradeDropdown(true);
      tradeInputRef.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/proj-for-sub/match-projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.name,
          company_name: formData.company,
          trade: formData.trade,
          location: formData.location,
          phone_number: formData.phone,
          email: formData.email,
          description: formData.experience,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const matchingTrades = await response.json();

      toast({
        title: "Registration Submitted!",
        description: "Processing your information...",
      });

      setTimeout(() => {
        navigate("/subcontractor-results", { 
          state: { 
            matchingTrades,
            userInfo: formData
          } 
        });
      }, 1000);
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: "Error",
        description: "Failed to fetch matching projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              {/* Trade and Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trade">Trade/Specialization *</Label>
                  <div className="relative">
                    <div className="relative">
                      <Input
                        id="trade"
                        ref={tradeInputRef}
                        placeholder="Type your trade or select from list"
                        value={formData.trade}
                        onChange={(e) => handleTradeInputChange(e.target.value)}
                        onFocus={handleTradeInputFocus}
                        disabled={isSubmitting}
                        required
                        className="pr-8"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                        onClick={handleTradeDropdownToggle}
                        disabled={isSubmitting}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${showTradeDropdown ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    
                    {/* Custom Dropdown */}
                    {showTradeDropdown && (
                      <div
                        ref={tradeDropdownRef}
                        className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
                      >
                        {filteredTrades.length > 0 ? (
                          filteredTrades.map((trade) => (
                            <div
                              key={trade}
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                              onClick={() => handleTradeSelect(trade)}
                            >
                              {trade}
                            </div>
                          ))
                        ) : (
                          <div className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground">
                            No trades found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sydney, NSW">Sydney, NSW</SelectItem>
                      <SelectItem value="Melbourne, VIC">Melbourne, VIC</SelectItem>
                      <SelectItem value="Brisbane, QLD">Brisbane, QLD</SelectItem>
                      <SelectItem value="Perth, WA">Perth, WA</SelectItem>
                      <SelectItem value="Adelaide, SA">Adelaide, SA</SelectItem>
                      <SelectItem value="Canberra, ACT">Canberra, ACT</SelectItem>
                      <SelectItem value="Darwin, NT">Darwin, NT</SelectItem>
                      <SelectItem value="Hobart, TAS">Hobart, TAS</SelectItem>
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
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Processing Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 shadow-2xl">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <User className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Processing Registration</h3>
                    <p className="text-sm text-muted-foreground">
                      We're analyzing your profile and matching you with relevant trade opportunities...
                    </p>
                  </div>
                  
                  <div className="w-full space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Matching trades...</span>
                      <span>Please wait</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full animate-pulse transition-all duration-1000" 
                           style={{width: "75%"}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subcontractor;
