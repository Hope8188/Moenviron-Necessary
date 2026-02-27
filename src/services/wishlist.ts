import { supabase } from "@/integrations/supabase/client";

export interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
  user_id: string;
}

export const wishlistService = {
  async getWishlist(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await (supabase as any)
      .from("wishlists")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return (data || []) as WishlistItem[];
  },

  async addToWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from("wishlists")
      .insert({ user_id: userId, product_id: productId });

    if (error) throw error;
  },

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from("wishlists")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) throw error;
  }
};
