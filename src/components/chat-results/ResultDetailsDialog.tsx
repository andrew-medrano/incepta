import { SearchResult } from "@/types/search";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResultDetailsDialogProps {
  selectedResult: SearchResult | null;
  isSelected: boolean;
  onSelect: () => void;
  onOpenChange: (open: boolean) => void;
}

const ResultDetailsDialog = ({
  selectedResult,
  isSelected,
  onSelect,
  onOpenChange
}: ResultDetailsDialogProps) => {
  const { toast } = useToast();

  if (!selectedResult) return null;

  return (
    <Dialog open={!!selectedResult} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-lg md:text-xl text-purple-900">
              {selectedResult.title}
            </DialogTitle>
            <div 
              className="cursor-pointer"
              onClick={onSelect}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center
                            ${isSelected 
                              ? 'text-yellow-400' 
                              : 'text-gray-300 hover:text-gray-400'}`}
              >
                <svg 
                  className="w-5 h-5" 
                  viewBox="0 0 24 24" 
                  fill={isSelected ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  strokeWidth="2"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <p className="text-xs md:text-sm text-gray-600">{selectedResult.university}</p>
          </div>
        </DialogHeader>
        <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
          <div className="prose prose-purple max-w-none">
            <div className="space-y-4">
              <p className="text-gray-800 whitespace-pre-wrap">
                {selectedResult.description}
              </p>
            </div>
          </div>

          {selectedResult.patents && (
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-sm font-semibold text-purple-800 mb-2">Related Patents</h3>
              <div className="bg-white rounded p-2 text-sm text-purple-700 border border-purple-100">
                {selectedResult.patents}
              </div>
            </div>
          )}

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-sm font-semibold text-purple-800 mb-2">Technology Details</h3>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-600">
                Reference Number: <span className="font-medium">{selectedResult.number}</span>
              </p>
              {selectedResult.page_url && (
                <a
                  href={selectedResult.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-700 hover:text-purple-900 rounded-md transition-colors border border-purple-100"
                >
                  <span>View Full Technology Details</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Licensing Inquiry Section */}
          <div className="mt-8 p-6 bg-purple-50 rounded-lg border-2 border-purple-100">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Interested in licensing this technology?
              </h3>
              <p className="text-sm text-purple-700 mb-4">
                Connect with our team to discuss licensing opportunities and learn more about this innovation.
              </p>
              <button
                onClick={() => {
                  toast({
                    title: "Contact Form",
                    description: "The contact form feature is coming soon!",
                  });
                }}
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Contact Us About Licensing
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDetailsDialog; 