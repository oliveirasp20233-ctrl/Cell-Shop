export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  priceFormatted: string;
  hasPrice: boolean;
  qualities: string[];
  description: string;
  compatibility: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  onlyWithPrice: boolean;
  quality: string;
  sortBy: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc';
}

export interface SavedOrder {
  id: string;
  createdAt: string; // ISO date string
  formattedDate: string;
  items: CartItem[];
  total: number;
  customerInfo?: {
    name?: string;
    storeName?: string;
    city?: string;
    notes?: string;
  };
}

