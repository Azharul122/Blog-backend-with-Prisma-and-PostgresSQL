export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PostFilters {
  category?: string[];
  tag?: string[];
  sort?: string[];
  search?: string;
  published?: boolean;
  page?: number;
  limit?: number;
}
