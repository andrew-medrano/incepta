import { SearchResult } from "@/types/search";

interface SelectedTechnologiesProps {
  selectedResults: SearchResult[];
  setSelectedResults: (results: SearchResult[]) => void;
  generatePDF: () => void;
}

const SelectedTechnologies = ({
  selectedResults,
  setSelectedResults,
  generatePDF
}: SelectedTechnologiesProps) => {
  if (selectedResults.length === 0) return null;

  return (
    <div className="mt-8 bg-purple-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-purple-900">
          Selected Technologies ({selectedResults.length})
        </h3>
        <button
          onClick={() => setSelectedResults([])}
          className="text-xs text-purple-600 hover:text-purple-800"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-2">
        {selectedResults.map((result, idx) => (
          <div key={idx} className="bg-white rounded-lg p-3 flex items-start gap-2 group">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-purple-900 truncate">{result.title}</p>
              <p className="text-xs text-purple-700 truncate">{result.university}</p>
            </div>
            <button
              onClick={() => setSelectedResults(selectedResults.filter(r => r.title !== result.title))}
              className="text-purple-400 hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={generatePDF}
        className="w-full mt-3 bg-purple-600 text-white rounded-lg py-2 px-4 text-sm font-medium
                 hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 10v6m-3-3h6" />
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        </svg>
        Generate Report
      </button>
    </div>
  );
};

export default SelectedTechnologies; 