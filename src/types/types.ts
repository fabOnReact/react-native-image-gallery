export interface Collection {
  id: number;
  title: string;
  description?: string;
  media_count: number;
  private: boolean;
}

export interface APIResponse {
  collections: Collection[];
  nextPage: number | null;
}
