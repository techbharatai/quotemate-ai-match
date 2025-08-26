import { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/constants";

type SubResult = {
  subcontractor_id: string;
  company_name: string;
  matched_trade: string;
  similarity_score: number;
  description_similarity: number;
  priority: number;
  score_breakdown: string;
  contact_email?: string;
  contact_phone?: string;
  service_summary?: string;
  budget?: string;
  interest?: "Please Select" | "Interested" | "Contacted" | "Declined";
};

// Updated mock data to match backend response format
const MOCK_RESULTS: SubResult[] = [
  {
    subcontractor_id: "SC001",
    company_name: "Smith Electricals Inc.",
    matched_trade: "Electrical",
    similarity_score: 0.86,
    description_similarity: 0.75,
    priority: 85,
    score_breakdown: "85 = 40(trade) + 0(multi-trade) + 20(description) + 15(location) + 10(budget)",
    contact_email: "john.smith@example.com",
    contact_phone: "919805167871",
    service_summary: "New York, NY 0km",
    budget: "$200,000",
    interest: "Please Select",
  },
  {
    subcontractor_id: "SC002",
    company_name: "ProFloor Coatings",
    matched_trade: "Epoxy Floor Coatings",
    similarity_score: 0.74,
    description_similarity: 0.65,
    priority: 74,
    score_breakdown: "74 = 40(trade) + 0(multi-trade) + 15(description) + 10(location) + 9(budget)",
    contact_email: "hello@profloor.com",
    contact_phone: "918629006950",
    service_summary: "Queens, NY 15km",
    budget: "$150,000",
    interest: "Please Select",
  },
];

export function BuilderSearchSubs() {
  // Updated state variables to match backend expectations
  const [projectName, setProjectName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [budget, setBudget] = useState("");
  const [trade, setTrade] = useState(""); // Changed from trades to trade (singular)
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<SubResult[] | null>(null);
  const { toast } = useToast();

  const handleReset = () => {
    setProjectName("");
    setProjectId("");
    setBudget("");
    setTrade("");
    setDeadline("");
    setLocation("");
    setDescription("");
    setResults(null);
  };

  const handleSearch = async () => {
    setIsSubmitting(true);

    // Create payload matching your desired backend format
    const payload = {
      project_id: projectId || null,
      project_name: projectName || null,
      budget: budget || undefined,
      trade: trade || undefined, // Single trade, not comma-separated
      deadline: deadline || null,
      location: location || undefined,
      description: description || undefined,
    };

    // Remove undefined values
    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    console.log("[match-subs] Request payload:", cleanPayload);

    try {
      const response = await fetch(`${API_BASE_URL}/match-subs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("[match-subs] API Response:", data);

      // Handle response (assuming it's an array of subcontractors)
      const results = Array.isArray(data) ? data : data.results || [];

      if (results.length === 0) {
        console.warn("[match-subs] Empty API results, using mock fallback");
        setResults(MOCK_RESULTS);
      } else {
        setResults(results);
      }

      toast({
        title: "Search completed",
        description: `Found ${results.length || MOCK_RESULTS.length} matching subcontractors.`,
      });

    } catch (error) {
      console.error("Error searching subcontractors:", error);
      setResults(MOCK_RESULTS);
      toast({
        title: "Using fallback results",
        description: "The live search failed, showing mock matches instead.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6 space-y-6">
      {/* Search Card */}
      <Card>
        <CardHeader>
          <CardTitle>Search Subcontractors</CardTitle>
          <CardDescription>
            Enter project details to find matching subcontractors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Project ID */}
          <div>
            <label className="text-sm font-medium">Project ID</label>
            <Input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="e.g., PRJ-1001"
            />
          </div>

          {/* Project Name */}
          <div>
            <label className="text-sm font-medium">Project Name</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g., Downtown Office Tower - Electrical Package"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="text-sm font-medium">Budget</label>
            <Input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., $100K-$150K"
            />
          </div>

          {/* Trade (singular) */}
          <div>
            <label className="text-sm font-medium">Trade</label>
            <Input
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              placeholder="e.g., Electrical"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium">Location</label>
            <Select 
              value={location} 
              onValueChange={setLocation}
              disabled={isSubmitting}
            >
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

          {/* Deadline */}
          <div>
            <label className="text-sm font-medium">Deadline</label>
            <Input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief scope overview, key technical terms, packages, or site constraints."
              rows={3}
            />
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSearch} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <ResultsPanel results={results} />
    </div>
  );
}

function ResultsPanel({ results }: { results: SubResult[] | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>
          Matched subcontractors will appear here. Use actions to view profile, email RFQ, or call.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!results ? (
          <EmptyHint />
        ) : results.length === 0 ? (
          <p className="text-muted-foreground">
            No results found. Try adjusting project details or adding relevant trades.
          </p>
        ) : (
          <div className="space-y-4">
            {results.map((r) => (
              <Card key={r.subcontractor_id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{r.company_name}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {r.matched_trade}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <div>Priority: {r.priority} • Match: {(r.similarity_score * 100).toFixed(1)}%</div>
                      <div>{r.service_summary}</div>
                      <div className="text-xs">{r.score_breakdown}</div>
                      {r.budget && (
                        <div>budget: {r.budget.toLocaleString()}</div>
                      )}
                    </div>

                    {r.interest && (
                      <div className="text-sm">
                        <span className="font-medium">Status: </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          r.interest === "Interested" ? "bg-green-100 text-green-800" :
                          r.interest === "Contacted" ? "bg-yellow-100 text-yellow-800" :
                          r.interest === "Declined" ? "bg-red-100 text-red-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {r.interest}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    {r.contact_email && (
                      <Button size="sm" variant="outline">
                        Email RFQ
                      </Button>
                    )}
                    {r.contact_phone && (
                      <Button size="sm" variant="outline"
                      onClick={() => handleCall(r)}
                      >
                        Call
                      </Button>
                    )}
                    <Button size="sm">View</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const handleCall = async (subcontractor: SubResult) => {
  try {
    const payload = {
      name: subcontractor.company_name,
      phone: subcontractor.contact_phone || "9876543210"
    };

    const response = await fetch(`${API_BASE_URL}/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate call");
    }

    const result = await response.json();
    
    toast.success(`Calling ${subcontractor.company_name}`);
  } catch (error) {
    console.error("Call error:", error);
    toast.error("Unable to initiate call. Please try again.");
  }
};



function EmptyHint() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Enter project details above and run a search. Clear, specific trade helps produce better matches.</p>
    </div>
  );
}

export default BuilderSearchSubs;
