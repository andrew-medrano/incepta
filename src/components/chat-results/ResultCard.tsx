import { SearchResult } from "@/types/search";

interface ResultCardProps {
  result: SearchResult;
  isSelected: boolean;
  onSelect: () => void;
  onClick: () => void;
  isPriority?: boolean;
}

const ResultCard = ({
  result,
  isSelected,
  onSelect,
  onClick,
  isPriority = false
}: ResultCardProps) => {
  return (
    <div 
      className={`bg-white p-4 rounded-lg flex flex-col relative
                ${isPriority 
                  ? 'border-2 border-purple-300 shadow-md hover:border-purple-400' 
                  : 'border border-purple-100 shadow-sm hover:border-purple-400'
                } hover:shadow-md transition-all duration-200`}
    >
      <div 
        className="absolute top-2 right-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <div className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer
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
      <div 
        className="flex-1 cursor-pointer"
        onClick={onClick}
      >
        <p className="font-semibold text-purple-900 text-lg mb-2 line-clamp-2 pr-8">{result.title}</p>
        <p className="text-sm text-purple-700 mb-3 font-medium">{result.university}</p>
        <p className="text-sm text-gray-600 line-clamp-3">
          {result.llm_teaser || result.llm_summary || result.description}
        </p>
      </div>
    </div>
  );
};

export default ResultCard; 