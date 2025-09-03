import { API_BASE_URL } from '@/config/constants';
import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';

interface SubcontractorData {
  id: string;
  name: string;
  email: string;
  phone: string;
  trades: string[];
  rating: number;
  location: string;
  experience: number;
  ai_generated_content?: string;
}

interface RFQProps {
  isVisible: boolean;
  subcontractorData: SubcontractorData;
  onClose: () => void;
  subcontractorRank: number;
  rfqId?: string;
}

const RFQ: React.FC<RFQProps> = ({
  isVisible,
  subcontractorData,
  onClose,
  subcontractorRank,
  rfqId
}) => {
  const modalRef = useRef(null);
  const [isCalling, setIsCalling] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);

  // Get builder info from AuthContext
  const { user } = useAuth();
  const builderId = user?.id || "";
  const builderName = user?.name || user?.email || "Unknown Builder";

  // Get project info from ProjectContext
  const { projectId } = useProject();

  // ... existing useEffect hooks ...

  // Updated handleCall function with loading state and redirect
  async function handleCall(phoneNumber: string, builderName: string, rfq: string) {
    setIsCalling(true);
    setShowCallPopup(true); // Show popup immediately

    try {
      const requestBody = {
        phoneNumber,
        builderName,
        rfq,
        project_id: projectId,
        subcontractor_id: subcontractorData.id,
        builder_id: builderId
      };

      console.log('Sending request:', requestBody);

      const response = await fetch(`${API_BASE_URL}/retell/start-call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to start call');
      }

      const result = await response.json();
      console.log('Call started successfully:', result);

      // Show popup for exactly 15 seconds on SUCCESS
      setTimeout(() => {
        setShowCallPopup(false);
        setIsCalling(false);
        window.location.href = '/builder-dashboard';
      }, 15000);

    } catch (error) {
      console.error('Error starting call:', error);

      // Show popup for exactly 15 seconds on FAILURE too
      setTimeout(() => {
        setShowCallPopup(false);
        setIsCalling(false);
        window.location.href = '/builder-dashboard';
        //alert('Failed to start call. Please try again.');
      }, 15000);
    }
  }

  if (!isVisible && !showCallPopup) return null;

  const CallPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">
          Call in Progress
        </h3>
        <p className="text-gray-600 mb-4">
          Connected with <strong>{subcontractorData.name}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Phone: {subcontractorData.phone}
        </p>
        <div className="mt-4 flex items-center justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">You Will Be Redirected to Dashboard shortly...</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Show calling popup when call is in progress */}
      {showCallPopup && <CallPopup />}

      {/* Original modal - only show when not calling */}
      {isVisible && !showCallPopup && (
        <>
          {/* Overlay - This is the clickable area outside the modal */}
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] p-5">
            {/* Modal - This has the ref to prevent clicks from closing */}
      <div 
        ref={modalRef}
          className="bg-card rounded-xl w-[90%] max-w-[1000px] max-h-[90vh] overflow-y-auto shadow-2xl rfq-modal-animate border border-border"
      >
              {/* Header */}
          <div className="flex justify-between items-start p-6 pb-4 border-b border-border sticky top-0 bg-card rounded-t-xl">
            <div>
              <h2 className="text-2xl font-semibold text-foreground m-0">
                Request for Quotation for Subcontractor - {subcontractorData.name}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="bg-none border-none text-2xl text-muted-foreground cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-muted hover:text-foreground"
            >
              ×
            </button>
          </div>

              {/* Content */}
          <div className="p-6">
            <textarea
              className="w-full h-[60vh] p-4 bg-input border border-border rounded-md text-foreground font-mono text-sm resize-none"
              value={subcontractorData.ai_generated_content || 'No RFQ content available'}
              readOnly
            />
              </div>

              {/* Footer with Action Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isCalling}
                  className={`px-4 py-2 rounded ${
                    isCalling 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Close
                </button>
                
                <button
                  onClick={() => handleCall(
                    subcontractorData.phone,
                    builderName,
                    subcontractorData.ai_generated_content || "RFQ details to be discussed"
                  )}
                  disabled={isCalling}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${
                    isCalling 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCalling && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  {isCalling ? 'Calling...' : 'Call for Quotation'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RFQ;
