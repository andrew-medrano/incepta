export interface SearchQuery {
  query: string;
  explanation: string;
}

export interface SearchQueryResponse {
  queries: SearchQuery[];
}

export interface SearchResult {
  id: string;
  title: string;
  university: string;
  number: string;
  description: string;
  published_date: string;
  patents: string;
  page_url: string;
  llm_summary?: string;
  llm_teaser?: string;
  score: number;
}

export interface Message {
  type: 'user' | 'system' | 'result';
  content: string;
  searchQueries?: SearchQuery[];
  results?: SearchResult[];
  isSearching?: boolean;
} 