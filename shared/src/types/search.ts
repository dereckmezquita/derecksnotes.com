export interface SearchResult {
  slug: string;
  title: string;
  section: string;
  tags: string[];
  date: string;
  author: string;
  snippet: string; // HTML with <mark> highlights
  path: string; // URL path e.g. /blog/my-post
  score: number;
  type: 'post' | 'comment';
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
  durationMs: number;
}
