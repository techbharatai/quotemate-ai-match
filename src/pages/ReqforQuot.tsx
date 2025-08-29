import React, { useRef, useEffect } from 'react';

interface SubcontractorData {
  id: string;
  name: string;
  email: string;
  phone: string;
  trades: string[];
  rating: number;
  location: string;
  experience: number;
  ai_generated_content?: string; // Add this for the RFQ content
}

interface RFQProps {
  isVisible: boolean;
  subcontractorData: SubcontractorData;
  onClose: () => void;
  subcontractorRank: number;
}

const RFQ: React.FC<RFQProps> = ({
  isVisible,
  subcontractorData,
  onClose,
  subcontractorRank
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onClose]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isVisible, onClose]);

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
                className="px-5 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 bg-card text-foreground border border-border hover:bg-muted"
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
