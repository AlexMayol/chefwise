/**
 * Supermarket Types
 *
 * Type definitions for the supermarkets feature.
 * These types match the database schema defined in:
 * supabase/migrations/002_create_supermarkets_table.sql
 */

/**
 * Supermarket entity as stored in the database
 */
export interface Supermarket {
  id: string;
  user_id: string;
  name: string;
  location?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Data Transfer Object for creating a new supermarket
 * Only includes fields that the user provides
 */
export interface CreateSupermarketDTO {
  name: string;
  location?: string;
  logo_url?: string;
}

/**
 * Data Transfer Object for updating an existing supermarket
 * All fields are optional since partial updates are allowed
 */
export interface UpdateSupermarketDTO {
  name?: string;
  location?: string;
  logo_url?: string;
}

/**
 * Supermarket with additional computed/joined fields
 * Used when displaying supermarket with related data
 */
export interface SupermarketWithProductCount extends Supermarket {
  product_count: number;
}
