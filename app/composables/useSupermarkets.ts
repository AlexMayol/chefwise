import type {
  Supermarket,
  CreateSupermarketDTO,
  UpdateSupermarketDTO,
} from "~/types/supermarket";

/**
 * Composable for managing supermarkets
 *
 * Provides CRUD operations for supermarkets with loading states and error handling.
 * All operations are scoped to the authenticated user via RLS policies.
 *
 * Note: Type assertions are used until database types are generated via:
 * `supabase gen types typescript --project-id <project-id> > types/database.ts`
 */
export function useSupermarkets() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = useSupabaseClient<any>();
  const user = useSupabaseUser();

  // Reactive state
  const supermarkets = ref<Supermarket[]>([]);
  const currentSupermarket = ref<Supermarket | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Fetch all supermarkets for the current user
   */
  async function getSupermarkets(): Promise<Supermarket[]> {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await client
        .from("supermarkets")
        .select("*")
        .order("name", { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      supermarkets.value = (data as Supermarket[]) || [];
      return supermarkets.value;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch supermarkets";
      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch a single supermarket by ID
   */
  async function getSupermarketById(id: string): Promise<Supermarket | null> {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await client
        .from("supermarkets")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      currentSupermarket.value = data as Supermarket;
      return data as Supermarket;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to fetch supermarket";
      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Create a new supermarket
   */
  async function createSupermarket(
    dto: CreateSupermarketDTO,
  ): Promise<Supermarket> {
    loading.value = true;
    error.value = null;

    try {
      if (!user.value?.id) {
        throw new Error("User not authenticated");
      }

      const { data, error: insertError } = await client
        .from("supermarkets")
        .insert({
          ...dto,
          user_id: user.value.id,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      const supermarket = data as Supermarket;
      // Add to local state
      supermarkets.value.push(supermarket);
      return supermarket;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to create supermarket";
      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update an existing supermarket
   */
  async function updateSupermarket(
    id: string,
    dto: UpdateSupermarketDTO,
  ): Promise<Supermarket> {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await client
        .from("supermarkets")
        .update(dto)
        .eq("id", id)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      const supermarket = data as Supermarket;
      // Update local state
      const index = supermarkets.value.findIndex((s) => s.id === id);
      if (index !== -1) {
        supermarkets.value[index] = supermarket;
      }

      if (currentSupermarket.value?.id === id) {
        currentSupermarket.value = supermarket;
      }

      return supermarket;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to update supermarket";
      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Delete a supermarket
   */
  async function deleteSupermarket(id: string): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await client
        .from("supermarkets")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      // Remove from local state
      supermarkets.value = supermarkets.value.filter((s) => s.id !== id);

      if (currentSupermarket.value?.id === id) {
        currentSupermarket.value = null;
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Failed to delete supermarket";
      error.value = message;
      throw new Error(message);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Clear error state
   */
  function clearError(): void {
    error.value = null;
  }

  /**
   * Reset all state
   */
  function reset(): void {
    supermarkets.value = [];
    currentSupermarket.value = null;
    loading.value = false;
    error.value = null;
  }

  return {
    // State
    supermarkets: readonly(supermarkets),
    currentSupermarket: readonly(currentSupermarket),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    getSupermarkets,
    getSupermarketById,
    createSupermarket,
    updateSupermarket,
    deleteSupermarket,
    clearError,
    reset,
  };
}
