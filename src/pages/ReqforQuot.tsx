// ReqforQuot.tsx
import { API_BASE_URL } from '@/config/constants';
import React, { useRef, useEffect } from 'react';
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
  rfqId?: string; // Only need rfqId as prop now
}

const RFQ: React.FC<RFQProps> = ({
  isVisible,
  subcontractorData,
  onClose,
  subcontractorRank,
  rfqId
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Get builder info from AuthContext
  const { user } = useAuth();
  const builderId = user?.id || "";
  const builderName = user?.name || user?.email || "Unknown Builder";
  
  // Get project info from ProjectContext
  const { projectId } = useProject();

  // ... existing useEffect hooks ...

  // Updated handleCall function
  async function handleCall(phoneNumber: string, builderName: string, rfq: string) {
    try {
      const requestBody = {
        phoneNumber,
        builderName,
        rfq,
        
        // All tracking data from contexts
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
      onClose();
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }

  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          @keyframes rfq-modal-appear {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(-10px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
          
          .rfq-modal-animate {
            animation: rfq-modal-appear 0.3s ease-out;
          }
        `}
      </style>
      
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
          <div className="px-6 py-5 border-t border-border bg-muted/50 rounded-b-xl sticky bottom-0">
            <div className="flex gap-3 justify-end flex-wrap">
            <button
              onClick={onClose}
                className="px-5 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 bg-secondary text-secondary-foreground border-none hover:bg-secondary/80"
            >
              Close
            </button>
            <button
              onClick={() => handleCall(
                subcontractorData.phone,
                builderName, // This can be undefined
                subcontractorData.ai_generated_content || "RFQ details to be discussed"
              )}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Call for Quotation
            </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RFQ;
