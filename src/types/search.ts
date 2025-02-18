export interface SearchQuery {
  query: string;
  explanation: string;
}

export interface SearchQueryResponse {
  queries: SearchQuery[];
}

export interface SearchResult {
  title: string;
  university: string;
  description: string;
  patents: string;
  llm_summary: string;
  llm_teaser: string;
  score: number;
}

export interface Message {
  type: 'user' | 'system' | 'result';
  content: string;
  searchQueries?: SearchQuery[];
  results?: SearchResult[];
  isSearching?: boolean;
} 