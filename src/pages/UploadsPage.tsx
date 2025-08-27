import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, FileText, Zap } from "lucide-react";
import { API_BASE_URL } from "@/config/constants";

// Step labels for your UI
const stepLabels = ["Project Files", "Results"];

function exportCSV(data: any[]) {
  if (!data || !data.length) return;
  const header = Object.keys(data[0]).join(",");
  const rows = data.map(obj =>
    Object.values(obj).map(String).map(v => `"${v.replace(/"/g, '""')}"`).join(",")
  );
  const csvContent = [header, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "subcontractor_matches.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function UploadsPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Project Input
  const [projectId, setProjectId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("");
  const [trade, setTrade] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  // File Upload
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [processedData, setProcessedData] = useState<any>(null);

  const handleSyncDatabase = () => {
    navigate("/builder");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    setFiles(selectedFiles);
    setFilePreviews([]);

    selectedFiles.forEach((file, i) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreviews(prev => {
            const newPrev = [...prev];
            newPrev[i] = reader.result as string;
            return newPrev;
          });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreviews(prev => {
          const newPrev = [...prev];
          newPrev[i] = "";
          return newPrev;
        });
      }
    });
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      alert("Please select files to process");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append(`files`, file);
      });

      const response = await fetch(`${API_BASE_URL}/file/process`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProcessedData(data);

      // Auto-populate form fields from AI-extracted project data
      if (data.success && data.project_extraction?.success && data.project_extraction.project_data) {
        const extracted = data.project_extraction.project_data;

        if (extracted.project_name && !projectName) setProjectName(extracted.project_name);
        if (extracted.location && !location) setLocation(extracted.location);
        if (extracted.budget && !budget) setBudget(extracted.budget);
        if (extracted.all_trades && !trade) setTrade(extracted.all_trades);
        if (extracted.project_due_date && !deadline) setDeadline(extracted.project_due_date);
        if (extracted.description && !description) setDescription(extracted.description);
      }

      alert("Files processed successfully!");

    } catch (error: any) {
      console.error('Error processing files:', error);
      alert(`Failed to process files: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormClear = () => {
    setProjectId("");
    setProjectName("");
    setBudget("");
    setTrade("");
    setLocation("");
    setDeadline("");
    setDescription("");
    setFiles([]);
    setFilePreviews([]);
    setProcessedData(null);
  };

  // --- REAL SEARCH FUNCTION ---
  const handleSearchSubcontractors = async () => {
    setIsSubmitting(true);

    // Build payload from the form (use extracted fields if available, fallback to manual)
    const payload = {
      project_id: projectId || null,
      project_name: projectName || null,
      budget: budget || undefined,
      trade: trade || undefined,
      deadline: deadline || null,
      location: location || undefined,
      description: description || undefined,
    };

    const cleanPayload = Object.fromEntries(
      Object.entries(payload).filter(([_, value]) => value !== undefined)
    );

    try {
      const response = await fetch(`${API_BASE_URL}/sub-file/match-subs`, {
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
      const apiResults = Array.isArray(data) ? data : data.results || [];
      setResults(apiResults);
      setStep(1);

    } catch (error) {
      console.error("Error searching subcontractors:", error);
      setResults([]);
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    if (results && results.length > 0) {
      exportCSV(results);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl text-black">
      {/* Sync Database Button */}
      <div className="mb-6">
        <Button 
          onClick={handleSyncDatabase}
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white" 
        >
          Sync Database
        </Button>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center mb-8">
        {stepLabels.map((label, idx) => (
          <div key={idx} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                idx <= step ? 'bg-green-400 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {idx + 1}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
            {idx < stepLabels.length - 1 && (
              <div className="w-16 h-1 bg-gray-300 mx-4"></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 0: Project Files */}
      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>1. Project Files</CardTitle>
            <CardDescription>
              Select your document/images here (PDF, Word, Excel, JPG, PNG, TXT), or manually enter details below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-700">
                 click to select files
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supported: PDF, DOC, XLS, JPG, PNG, TXT etc.
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt,.text"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* File Previews */}
            {files.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Files to be Processed:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {files.map((file, i) => (
                    <div key={i} className="border rounded-lg p-3 flex items-center space-x-3">
                      {filePreviews[i] ? (
                        <img src={filePreviews[i]} alt="Preview" className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <FileText className="w-12 h-12 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Process Files Button */}
                <div className="flex justify-end">
                  <Button 
                    onClick={handleProcessFiles} 
                    disabled={isProcessing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Process Files
                      </>
                    )}
                  </Button>
                </div>
                {/* Show processed data status */}
                {processedData && processedData.success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✓ Files processed successfully!</p>
                    <p className="text-green-600 text-sm mt-1">
                      Extracted data has been auto-populated in the form below.
                    </p>
                    {processedData.project_extraction?.confidence_score && (
                      <p className="text-green-600 text-sm">
                        Confidence: {processedData.project_extraction.confidence_score.toFixed(1)}%
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Manual Entry Form - Auto-populated after processing */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Project Details {processedData?.success ? "(Auto-populated)" : ""}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <Input
                  placeholder="Budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <Input
                  placeholder="Trades Required"
                  value={trade}
                  onChange={(e) => setTrade(e.target.value)}
                />
                <Input
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <Input
                  placeholder="Deadline"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Project Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleFormClear}>
                Clear
              </Button>
              <Button onClick={handleSearchSubcontractors} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Search Subcontractors
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Results */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Subcontractor Results</CardTitle>
            <CardDescription>
              Matched subcontractors. Use actions to view profile, email RFQ, call, or export results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!results || results.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found. Try adjusting project details or adding relevant trades.</p>
              <Button  className="py-2 mt-4"
              onClick={() => setStep(0)}>
                    Back
                  </Button>
              </div>
            ) : (
              <>
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
                                        //onClick="This feature is work in progress"
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
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button variant="outline" onClick={() => setStep(0)}>Start New Project</Button>
                  <Button onClick={handleExport}>Export as CSV</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default UploadsPage;
