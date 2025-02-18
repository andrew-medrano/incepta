import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PDFGenerationDialogProps {
  isGeneratingPDF: boolean;
  generatedPDFBlob: Blob | null;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
}

const PDFGenerationDialog = ({
  isGeneratingPDF,
  generatedPDFBlob,
  onOpenChange,
  onDownload
}: PDFGenerationDialogProps) => {
  return (
    <Dialog 
      open={isGeneratingPDF || !!generatedPDFBlob} 
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isGeneratingPDF ? "Generating Report" : "Report Ready"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4">
          {isGeneratingPDF ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
              <p className="text-center text-sm text-gray-600">
                Please wait while we prepare your report...
              </p>
            </>
          ) : generatedPDFBlob ? (
            <>
              <svg 
                className="h-8 w-8 text-green-600 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-center text-sm text-gray-600 mb-4">
                Your report has been generated successfully!
              </p>
              <button
                onClick={onDownload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 
                         bg-purple-600 text-white rounded-lg font-medium
                         hover:bg-purple-700 transition-colors"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Report
              </button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFGenerationDialog; 