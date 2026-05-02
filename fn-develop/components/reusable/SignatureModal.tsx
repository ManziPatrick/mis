"use client"
import React, { useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureModalProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: (signatureData: string) => void;
  title?: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ 
  visible, 
  onHide, 
  onConfirm, 
  title = "Digital Signature" 
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  // Clear canvas when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        sigCanvas.current?.clear();
      }, 100);
    }
  }, [visible]);

  const clear = () => {
    sigCanvas.current?.clear();
  };

  const handleConfirm = () => {
    if (!sigCanvas.current) return;
    
    if (sigCanvas.current.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }

    try {
      // Use the raw canvas directly to avoid trimming issues
      const canvas = sigCanvas.current.getCanvas();
      if (canvas) {
        const dataURL = canvas.toDataURL('image/png');
        if (dataURL) {
          onConfirm(dataURL);
          onHide();
        }
      }
    } catch (error) {
      console.error("Signature capture error:", error);
      alert("Failed to capture signature. Please try again.");
    }
  };

  return (
    <Dialog 
      header={title} 
      visible={visible} 
      onHide={onHide} 
      className="w-[95vw] md:w-[500px]"
      draggable={false}
      resizable={false}
    >
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="text-center">
          <p className="text-[#2E3487] font-[600] text-[15px]">Please Sign Below</p>
          <p className="text-gray-500 text-[12px]">Use your mouse or touch screen to draw your signature</p>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:border-[#2E3487] transition-colors">
          <SignatureCanvas 
            ref={sigCanvas}
            penColor='black'
            canvasProps={{
              width: 450, 
              height: 200, 
              className: 'sigCanvas'
            }}
          />
        </div>

        <div className="flex gap-3 w-full">
          <button 
            onClick={clear}
            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-[8px] text-[13px] font-[500] hover:bg-gray-50 transition-colors"
          >
            Clear Canvas
          </button>
          <button 
            onClick={onHide}
            className="flex-1 px-4 py-2.5 border border-red-100 text-red-600 rounded-[8px] text-[13px] font-[500] hover:bg-red-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-[2] px-6 py-2.5 bg-[#2E3487] text-white rounded-[8px] text-[13px] font-[600] hover:opacity-90 transition-all shadow-md shadow-blue-900/10"
          >
            Confirm & Save Signature
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SignatureModal;

