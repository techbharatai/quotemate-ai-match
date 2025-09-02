import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/constants";


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

interface ContactedSubcontractor {
  id: string;
  call_id: string;
  status: string;
  created_at: string;
  rfq: string;
  transcript?: string;
  subcontractor: {
    id: string;
    company?: string;
    name: string;
    email?: string;
    phone?: string;
    location?: string;
    trades?: string[];
    rating?: number;
    experience?: number;
  };
  project: {
    id: string;
    project_name: string;
    budget?: string;
    trades: string;
    location?: string;
    description?: string;
    
  };
}


const BuilderDashboard = () => {
  const [showTrades, setShowTrades] = useState(false);
  const [showContactedSubs, setShowContactedSubs] = useState(false);
  const [contactedSubcontractors, setContactedSubcontractors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [selectedTranscript, setSelectedTranscript] = useState<string>('');
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null);
  const [showSubcontractorModal, setShowSubcontractorModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleFindTrades = () => {
    setShowTrades(true);
    setShowContactedSubs(false);
  };

  const fetchSubcontractorDetails = async (subcontractorId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/retell/subcontractor/${subcontractorId}`);
      if (!response.ok) throw new Error('Failed to fetch subcontractor details');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching subcontractor details:', error);
      return null;
    }
  };
  
  
  const fetchProjectDetails = async (projectId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/retell/project/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project details');
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching project details:', error);
      return null;
    }
  };
  
  const handleSubcontractorClick = async (subcontractor: any) => {
    const details = await fetchSubcontractorDetails(subcontractor.id);
    setSelectedSubcontractor(details || subcontractor);
    setShowSubcontractorModal(true);
  };
  
  const handleProjectClick = async (project: any) => {
    const details = await fetchProjectDetails(project.id);
    setSelectedProject(details || project);
    setShowProjectModal(true);
  };
  

  const handleShowContactedSubcontractors = async () => {
    if (!user) {
      console.error('No user found');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/retell/builder/${user.id}/contacted-subcontractors`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacted subcontractors');
      }

      const result = await response.json();
      setContactedSubcontractors(result.data);
      setShowContactedSubs(true);
      setShowTrades(false);
    } catch (error) {
      console.error('Error fetching contacted subcontractors:', error);
      alert('Failed to load contacted subcontractors');
    } finally {
      setLoading(false);
    }
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

        {/*contacted sub  */}
          {showContactedSubs && (
          <Card className="card-shadow border-border/20 mb-8">
            <CardHeader>
              <CardTitle>Contacted Subcontractors</CardTitle>
              <CardDescription>
                All RFQ calls made to subcontractors with status and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : contactedSubcontractors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No contacted subcontractors found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subcontractor Name</TableHead>
                        <TableHead>Project Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Transcript</TableHead>
                        
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contactedSubcontractors.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <button
                                className="text-left hover:text-blue-600 underline font-medium"
                                onClick={() => handleSubcontractorClick(item.subcontractors)}
                              >
                                {item.subcontractors?.name || 'Unknown'}
                              </button>
                              <br />
                              <small className="text-gray-500">ID: {item.subcontractor_id}</small>
                            </TableCell>
                            <TableCell>
                              <button
                                className="text-left hover:text-blue-600 underline font-medium"
                                onClick={() => handleProjectClick(item.projects)}
                              >
                                {item.projects?.project_name || 'Unknown Project'}
                              </button>
                              <br />
                              <small className="text-gray-500">ID: {item.project_id}</small>
                            </TableCell>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="max-w-xs">
                                {item.transcript ? (
                                  <button
                                    className="text-left hover:text-blue-600 underline"
                                    onClick={() => {
                                      setSelectedTranscript(item.transcript);
                                      setShowTranscriptModal(true);
                                    }}
                                  >
                                    {item.transcript.length > 100 
                                      ? `${item.transcript.substring(0, 100)}...` 
                                      : item.transcript
                                    }
                                  </button>
                                ) : (
                                  <span className="text-gray-400 italic">No transcript available</span>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
          )}
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
              onClick={handleShowContactedSubcontractors}
              className="flex justify-center bg-blue-600 hover:bg-blue-700 text-white" 
            >
              See Contacted Subcontractors
            </Button>
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
                      {/* Transcript Modal */}
                            {showTranscriptModal && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-background p-6 rounded-lg max-w-2xl max-h-96 overflow-y-auto">
                                  <h3 className="text-lg text-muted-foreground font-semibold mb-4">Call Transcript</h3>
                                  <p className="text-sm whitespace-pre-wrap">{selectedTranscript}</p>
                                  <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={() => setShowTranscriptModal(false)}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            )}

                        {/* Subcontractor Details Modal */}
                            {showSubcontractorModal && selectedSubcontractor && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-background p-6 rounded-lg max-w-lg max-h-96 overflow-y-auto">
                                  <h3 className="text-lg text-muted-foreground font-semibold mb-4">Subcontractor Details</h3>
                                  <div className="space-y-3">
                                    <div>
                                      <strong>ID:</strong> {selectedSubcontractor.id || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Name:</strong> {selectedSubcontractor.name || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Company:</strong> {selectedSubcontractor.company || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Budget:</strong> {selectedSubcontractor.budget || 'N/A'}
                                    </div>
                                    {selectedSubcontractor.description && (
                                      <div>
                                        <strong>Description:</strong>
                                        <p className="mt-1 text-sm text-muted-foreground max-h-32 overflow-y-auto whitespace-pre-wrap">
                                          {selectedSubcontractor.description}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={() => setShowSubcontractorModal(false)}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            )}


                        {/* Project Details Modal */}
                            {showProjectModal && selectedProject && (
                              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-background p-6 rounded-lg max-w-2xl max-h-96 overflow-y-auto">
                                  <h3 className="text-lg text-muted-foreground font-semibold mb-4">Project Details</h3>
                                  <div className="space-y-3">
                                    <div>
                                      <strong>Project Name:</strong> {selectedProject.project_name || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Budget:</strong> {selectedProject.budget || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Location:</strong> {selectedProject.location || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Trades:</strong> {selectedProject.trades || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Description:</strong> {selectedProject.description || 'N/A'}
                                    </div>
                                  </div>
                                  <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={() => setShowProjectModal(false)}
                                  >
                                    Close
                                  </button>
                                </div>
                              </div>
                            )}

      </div>
    </div>    
  );
};

export default BuilderDashboard;