/**
 * Supabase schema types for supabase/migrations/20261007000000_init.sql.
 *
 * Hand-maintained to match the migration. After changing the schema you can
 * regenerate with the Supabase CLI and replace this file:
 *   npx supabase gen types typescript --project-id <ref> --schema public > src/lib/supabase/database.types.ts
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type ContentStatus = "draft" | "published";

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          body: string;
          cover_image_url: string | null;
          cover_image_alt: string | null;
          author_name: string;
          author_role: string | null;
          tags: string[];
          reading_minutes: number | null;
          /** Generated column: whitespace-delimited word count of body. */
          word_count: number;
          seo_title: string | null;
          seo_description: string | null;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string;
          body?: string;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          author_name?: string;
          author_role?: string | null;
          tags?: string[];
          reading_minutes?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
        Relationships: [];
      };
      case_studies: {
        Row: {
          id: string;
          slug: string;
          client_name: string;
          title: string;
          summary: string;
          sector: string | null;
          location: string | null;
          services: string[];
          challenge: string;
          approach: string;
          outcome: string;
          metrics: Json;
          cover_image_url: string | null;
          cover_image_alt: string | null;
          website_url: string | null;
          year: number | null;
          featured: boolean;
          sort_order: number;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          client_name: string;
          title: string;
          summary?: string;
          sector?: string | null;
          location?: string | null;
          services?: string[];
          challenge?: string;
          approach?: string;
          outcome?: string;
          metrics?: Json;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          website_url?: string | null;
          year?: number | null;
          featured?: boolean;
          sort_order?: number;
          status?: ContentStatus;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["case_studies"]["Insert"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          author_name: string;
          author_title: string | null;
          company: string | null;
          case_study_id: string | null;
          featured: boolean;
          sort_order: number;
          status: ContentStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          author_name: string;
          author_title?: string | null;
          company?: string | null;
          case_study_id?: string | null;
          featured?: boolean;
          sort_order?: number;
          status?: ContentStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "testimonials_case_study_id_fkey";
            columns: ["case_study_id"];
            isOneToOne: false;
            referencedRelation: "case_studies";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_submissions: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          email: string;
          company: string | null;
          role: string | null;
          phone: string | null;
          company_type: string | null;
          services: string[];
          budget: string | null;
          timeline: string | null;
          message: string;
          source_path: string | null;
          consent: boolean;
          status: "new" | "contacted" | "qualified" | "closed" | "spam";
        };
        /** Only these columns are granted to the anon role. */
        Insert: {
          name: string;
          email: string;
          company?: string | null;
          role?: string | null;
          phone?: string | null;
          company_type?: string | null;
          services?: string[];
          budget?: string | null;
          timeline?: string | null;
          message: string;
          source_path?: string | null;
          consent: boolean;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
