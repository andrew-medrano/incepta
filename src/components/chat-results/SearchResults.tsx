import { Loader2 } from "lucide-react";
import { SearchResult } from "@/types/search";
import ResultCard from "@/components/chat-results/ResultCard";

interface SearchResultsProps {
  searchResults: SearchResult[];
  isSearching: boolean;
  setSelectedResult: (result: SearchResult | null) => void;
  toggleResultSelection: (result: SearchResult) => void;
  isResultSelected: (result: SearchResult) => boolean;
}

const SearchResults = ({
  searchResults,
  isSearching,
  setSelectedResult,
  toggleResultSelection,
  isResultSelected
}: SearchResultsProps) => {
  if (searchResults.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/95 p-3 md:p-4 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4 px-8">
        <h2 className="font-semibold text-xl text-purple-900">Search Results</h2>
      </div>

      <div className="space-y-8 px-8">
        {/* Top 6 Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {searchResults.slice(0, 6).map((result, idx) => (
            <ResultCard
              key={idx}
              result={result}
              isSelected={isResultSelected(result)}
              onSelect={() => toggleResultSelection(result)}
              onClick={() => setSelectedResult(result)}
              isPriority={true}
            />
          ))}
        </div>

        {/* Divider and Additional Results */}
        {searchResults.length > 6 && (
          <>
            <div className="border-t-2 border-purple-200" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {searchResults.slice(6).map((result, idx) => (
                <ResultCard
                  key={idx}
                  result={result}
                  isSelected={isResultSelected(result)}
                  onSelect={() => toggleResultSelection(result)}
                  onClick={() => setSelectedResult(result)}
                  isPriority={false}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Loading Indicator */}
      {isSearching && (
        <div className="flex items-center justify-center space-x-2 text-purple-700 mt-10">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading search results...</span>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 