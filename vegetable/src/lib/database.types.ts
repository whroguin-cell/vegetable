// Supabase schema types — keep in sync with supabase/schema.sql.
// These are hand-written; run `supabase gen types typescript` if you
// prefer auto-generated types later.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Region = {
  id: string;
  num: string;
  area: string;
  en: string;
  farms: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type RegionInsert = Omit<Region, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type Producer = {
  id: string;
  num: string;
  name: string;
  name_en: string;
  region: string;
  prefecture: string | null;
  main_produce: string | null;
  characteristics: string | null;
  image_url: string | null;
  items: string[];
  note: string | null;
  sort_order: number;
  photo1_url: string | null;
  photo1_caption: string | null;
  photo2_url: string | null;
  photo2_caption: string | null;
  photo3_url: string | null;
  photo3_caption: string | null;
  created_at: string;
  updated_at: string;
};

export type ProducerInsert = Omit<Producer, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type Product = {
  id: string;
  ja: string;
  en: string;
  emoji: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductInsert = Omit<Product, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type NewsItem = {
  id: string;
  date: string;
  category: string;
  category_ja: string | null;
  title: string;
  body: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type NewsInsert = Omit<NewsItem, "id" | "created_at" | "updated_at"> & {
  id?: string;
};

export type Admin = {
  user_id: string;
  email: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      regions:   { Row: Region;   Insert: RegionInsert;   Update: Partial<RegionInsert>; Relationships: [] };
      producers: { Row: Producer; Insert: ProducerInsert; Update: Partial<ProducerInsert>; Relationships: [] };
      products:  { Row: Product;  Insert: ProductInsert;  Update: Partial<ProductInsert>; Relationships: [] };
      news:      { Row: NewsItem; Insert: NewsInsert;     Update: Partial<NewsInsert>; Relationships: [] };
      admins:    { Row: Admin;    Insert: Partial<Admin>; Update: Partial<Admin>; Relationships: [] };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
