import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Loader2, Upload, FileText, Zap } from "lucide-react";
import { API_BASE_URL } from "@/config/constants";
import RFQ from './ReqforQuot'; // Added RFQ import
import { useProject } from "@/context/ProjectContext";



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

// ✅ NEW: Function to get user ID from storage
const getUserId = () => {
  const USER_KEY = 'user_data';
  
  // Try localStorage first, then sessionStorage
  let userData = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      return parsedUser.id;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};



function UploadsPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

    const { setProjectInfo } = useProject();
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

  const [isDragActive, setIsDragActive] = useState(false);

// Drag and Drop handlers
const handleDragEnter = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragActive(true);
};

const handleDragLeave = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragActive(false);
};

const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragActive(false);
  
  const droppedFiles = Array.from(e.dataTransfer.files);
  if (droppedFiles.length > 0) {
    // Take only the first file for single file upload
    const syntheticEvent = {
      target: {
        files: [droppedFiles[0]] // Only first file
      }
    } as any; // This fixes the red line
    
    handleFileChange(syntheticEvent);
  }
};


  // Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [processedData, setProcessedData] = useState<any>(null);

  // RFQ Modal state - Added these two lines
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<any>(null);
  const [isRFQModalVisible, setIsRFQModalVisible] = useState(false);

  const handleSyncDatabase = () => {
    navigate("/builder");
  };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    
    if (selectedFiles.length === 0) return;
    
    setFiles(selectedFiles);
    setFilePreviews([]);

    // Generate previews
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

    // ✅ NEW: Process files automatically using the selected files directly
    await processFilesAutomatically(selectedFiles);
  };

// New helper function for automatic processing
const processFilesAutomatically = async (filesToProcess: File[]) => {
  setIsProcessing(true);
  const userId = getUserId();
  console.log('Auto-processing files, User ID:', userId);

  try {
    const formData = new FormData();
    filesToProcess.forEach(file => {
      formData.append(`files`, file);
    });
    
    const url = userId 
      ? `${API_BASE_URL}/file/process?user_id=${encodeURIComponent(userId)}`
      : `${API_BASE_URL}/file/process`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Auto-process response:', data);
    setProcessedData(data);

    // Auto-populate form fields from AI-extracted project data
    if (data.success && data.project_extraction?.success && data.project_extraction.project_data) {
      const extracted = data.project_extraction.project_data;

      // Always overwrite existing data with newly extracted data
      if (extracted.project_name) setProjectName(extracted.project_name);
      if (extracted.location) setLocation(extracted.location);
      if (extracted.budget) setBudget(extracted.budget);
      if (extracted.all_trades) setTrade(extracted.all_trades);
      if (extracted.project_due_date) setDeadline(extracted.project_due_date);
      if (extracted.description) setDescription(extracted.description);
    }


    handleFileProcessingSuccess(data);

  } catch (error: any) {
    console.error('Error auto-processing files:', error);
    alert(`Failed to process files automatically: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};



  // ✅ UPDATED: Modified handleProcessFiles to include user_id
  const handleProcessFiles = async () => {
    if (files.length === 0) {
      alert("Please select files to process");
      return;
    }
  
    setIsProcessing(true);
    const userId = getUserId();
    console.log('User ID:', userId);
  
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append(`files`, file);
      });
      
      const url = userId 
        ? `${API_BASE_URL}/file/process?user_id=${encodeURIComponent(userId)}`
        : `${API_BASE_URL}/file/process`;
  
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Process response:', data);
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
  
      // Call the function to store project ID in context
      handleFileProcessingSuccess(data);
  
      let message = "Files processed successfully!";
      if (data.project_extraction?.supabase_saved) {
        message += ` Project saved to database with ID: ${data.project_extraction.supabase_id}`;
      } else if (data.project_extraction?.supabase_error) {
        message += ` (Database save failed: ${data.project_extraction.supabase_error})`;
      }
      
      alert(message);
  
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

  const handleFileProcessingSuccess = (result) => {
    if (result.project_extraction?.supabase_saved) {
      setProjectInfo({
        projectId: result.project_extraction.supabase_id,
        projectData: result.project_extraction.project_data
      });
    }
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
      user_id: getUserId(),
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
      
      // NEW: Handle the new response structure with ai_generated_rfqs
      const apiResults = data.matched_subcontractors || [];
      const aiRFQs = data.ai_generated_rfqs || [];
      
      // Create a map of RFQs by subcontractor_id for easy lookup
      const rfqMap = {};
      aiRFQs.forEach(rfq => {
        rfqMap[rfq.subcontractor_id] = rfq.ai_generated_content;
      });
      
      // Add RFQ content to subcontractor results
      const resultsWithRFQ = apiResults.map(subcontractor => ({
        ...subcontractor,
        ai_generated_content: rfqMap[subcontractor.subcontractor_id] || null
      }));
      
      setResults(resultsWithRFQ);
      setStep(1);

    } catch (error) {
      console.error("Error searching subcontractors:", error);
      setResults([]);
      setStep(1);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle opening RFQ modal
  const handleViewRFQ = (subcontractor: any, rank: number) => {
    // Convert your result format to SubcontractorData format
    const subcontractorData = {
      id: subcontractor.subcontractor_id || subcontractor.id || "unknown",
      name: subcontractor.company_name || "Unknown Company",
      email: subcontractor.contact_email || "contact@company.com",
      phone: subcontractor.contact_phone || "+91-98765-43210",
      trades: subcontractor.matched_trade ? [subcontractor.matched_trade] : [],
      rating: subcontractor.rating || 4.5,
      location: subcontractor.location || location || "Unknown",
      experience: subcontractor.experience || 10,
      ai_generated_content: subcontractor.ai_generated_content, // Add this line
      rank
    };
    setSelectedSubcontractor(subcontractorData);
    setIsRFQModalVisible(true);
  };

  // Handle closing RFQ modal - Added this function
  const handleCloseRFQ = () => {
    setIsRFQModalVisible(false);
    setSelectedSubcontractor(null);
  };

  const handleExport = () => {
    if (results && results.length > 0) {
      exportCSV(results);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl text-black">
      {/* Sync Database Button */}
      <div className="mb-6 flex items-center justify-between">
        <Button 
          onClick={handleSyncDatabase}
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white" 
        >
          Sync Database
        </Button>
        <Button 
            size="sm"
            onClick={() => navigate("/builder-dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white" 
          >
            Builder Dashboard
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
            {/* File Upload Area with Drag and Drop + Click to Select */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragActive 
                  ? 'border-blue-400 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload className={`mx-auto h-12 w-12 transition-colors ${
                isDragActive ? 'text-blue-400' : 'text-gray-400'
              }`} />
              <p className={`mt-2 text-sm font-medium transition-colors ${
                isDragActive ? 'text-blue-700' : 'text-gray-700'
              }`}>
                {isDragActive ? 'Drop files here' : 'Drag and drop files here or click to select'}
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
                
                {/* Flex container for side-by-side layout */}
                <div className="flex gap-6">
                  {/* File Previews - Left Side */}
                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-4">
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
                          
                          {/* Status indicator in the same row */}
                          <div className="flex items-center">
                            {isProcessing ? (
                              <div className="flex items-center text-blue-600">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span className="text-xs">Processing...</span>
                              </div>
                            ) : processedData && processedData.success ? (
                              <div className="flex items-center text-green-600">
                                <span className="text-xs">✓ Processed</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-500">
                                <span className="text-xs">Ready</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall status message card - Right Side */}
                  <div className="w-80 flex-shrink-0">
                    {processedData && processedData.success && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 sticky top-2">
                        <p className="text-green-600 text-xs mt-1">
                          ✓ file processed successfully!
                        </p>
                        {processedData.project_extraction?.confidence_score && (
                          <p className="text-green-600 text-xs">
                            Confidence: {processedData.project_extraction.confidence_score.toFixed(1)}%
                          </p>
                        )}
                        {processedData.project_extraction?.supabase_saved ? (
                          <p className="text-blue-600 text-xs">
                            ✅ Project saved to database (ID: {processedData.project_extraction.supabase_id})
                          </p>
                        ) : processedData.project_extraction?.supabase_error ? (
                          <p className="text-orange-600 text-sm">
                            ⚠️ Database save failed: {processedData.project_extraction.supabase_error}
                          </p>
                        ) : (
                          <p className="text-gray-600 text-sm">
                            ℹ️ Project not saved to database (no user session)
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Show placeholder when no processed data */}
                    {!processedData && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-gray-500 text-sm">
                          Processing status will appear here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}


            {/* Manual Entry Form - Auto-populated after processing */}
              <div className="space-y-6"> {/* Increased space between form sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap for better spacing */}
                  {/* Project Name */}
                  <div className={`${projectName ? 'space-y-2' : ''}`}> {/* Dynamic spacing */}
                    {projectName && (
                      <label htmlFor="projectName" className="block text- font-medium text-white">
                        Project Name
                      </label>
                    )}
                    <div className="relative">
                      <Input
                        id="projectName"
                        placeholder={projectName ? "Enter project name" : " "}
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className={projectName ? "w-full" : "peer pt-6 pb-2"}
                      />
                      {!projectName && (
                        <label 
                          htmlFor="projectName" 
                          className="absolute left-3 text-sm text-white/70 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:top-1 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
                        >
                          Project Name
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Budget */}
                  <div className={`${budget ? 'space-y-2' : ''}`}>
                    {budget && (
                      <label htmlFor="budget" className="block text-md font-medium text-white">
                        Budget
                      </label>
                    )}
                    <div className="relative">
                      <Input
                        id="budget"
                        placeholder={budget ? "Enter budget" : " "}
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className={budget ? "w-full" : "peer pt-6 pb-2"}
                      />
                      {!budget && (
                        <label 
                          htmlFor="budget" 
                          className="absolute left-3 text-sm text-white/70 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:top-1 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
                        >
                          Budget
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Trade */}
                  <div className={`${trade ? 'space-y-2' : ''}`}>
                    {trade && (
                      <label htmlFor="trade" className="block text-md font-medium text-white">
                        Trades Required
                      </label>
                    )}
                    <div className="relative">
                      <Input
                        id="trade"
                        placeholder={trade ? "Enter required trades" : " "}
                        value={trade}
                        onChange={(e) => setTrade(e.target.value)}
                        className={trade ? "w-full" : "peer pt-6 pb-2"}
                      />
                      {!trade && (
                        <label 
                          htmlFor="trade" 
                          className="absolute left-3 text-sm text-white/70 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:top-1 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
                        >
                          Trades Required
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className={`${location ? 'space-y-2' : ''}`}>
                    {location && (
                      <label htmlFor="location" className="block text-md font-medium text-white">
                        Location
                      </label>
                    )}
                    <div className="relative">
                      <Input
                        id="location"
                        placeholder={location ? "Enter location" : " "}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={location ? "w-full" : "peer pt-6 pb-2"}
                      />
                      {!location && (
                        <label 
                          htmlFor="location" 
                          className="absolute left-3 text-sm text-white/70 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:top-1 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
                        >
                          Location
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className={`${deadline ? 'space-y-2' : ''}`}>
                    {deadline && (
                      <label htmlFor="deadline" className="block text-md font-medium text-white">
                        Deadline
                      </label>
                    )}
                    <div className="relative">
                      <Input
                        id="deadline"
                        placeholder={deadline ? "Enter deadline" : " "}
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={deadline ? "w-full" : "peer pt-6 pb-2"}
                      />
                      {!deadline && (
                        <label 
                          htmlFor="deadline" 
                          className="absolute left-3 text-sm text-white/70 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:top-1 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
                        >
                          Deadline
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description with Textarea */}
                <div className={`${description ? 'space-y-2' : ''}`}>
                  {description && (
                    <label htmlFor="description" className="block text-md font-medium text-white">
                      Project Description
                    </label>
                  )}
                  <div className="relative">
                    <Textarea
                      id="description"
                      placeholder={description ? "Enter project description" : " "}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={description ? "min-h-[100px] w-full" : "peer pt-6 pb-2 min-h-[100px]"}
                      rows={4}
                    />
                    {!description && (
                      <label 
                        htmlFor="description" 
                        className="absolute left-3 text-sm text-white/70 transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/70 peer-focus:top-1 peer-focus:text-xs peer-focus:text-white peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-white"
                      >
                        Project Description
                      </label>
                    )}
                  </div>
                </div>
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
              Matched subcontractors. Use actions to view RFQ, call 
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
                  {results.slice(0, 5).map((r, index) => (             /*show only top 5 results here */ 
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
                                      {/* TODO: Change this number (3) to desired number of subcontractors who can view RFQ */}
                                      {index < 3 && (
                                        <Button 
                                          size="sm"
                                          onClick={() => handleViewRFQ(r, index + 1)}
                                        >
                                          View RFQ
                                        </Button>
                                      )}
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

      {/* RFQ Modal - Added this component */}
      {selectedSubcontractor && (
        <RFQ
          isVisible={isRFQModalVisible}
          subcontractorData={selectedSubcontractor}
          onClose={handleCloseRFQ}
          subcontractorRank={selectedSubcontractor.rank}
        />
      )}
    </div>
  );
}

export default UploadsPage;
