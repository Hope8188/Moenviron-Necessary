import { supabase } from "@/integrations/supabase/client";

export type ProductInteractionType = 'view' | 'add_to_cart' | 'purchase';

const getSessionId = () => {
  let sessionId = sessionStorage.getItem('moenviron-session-id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('moenviron-session-id', sessionId);
  }
  return sessionId;
};

/**
 * Track product interactions (views, add_to_cart, purchases).
 * This is fire-and-forget — errors are silently logged, never thrown.
 * This prevents analytics failures from breaking the product page.
 */
export const trackProductInteraction = async (
  productId: string,
  type: ProductInteractionType,
  productName?: string,
  revenue?: number
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if a record exists for this product and date
    const { data: existing, error: fetchError } = await (supabase as any)
      .from('product_performance_stats')
      .select('*')
      .eq('product_id', productId)
      .eq('date', today)
      .maybeSingle();

    if (fetchError) {
      // Silently fail — don't block the UI
      console.debug('Analytics fetch skipped:', fetchError.message);
      return;
    }

    if (existing) {
      const updates: Record<string, number> = {};

      if (type === 'view') {
        updates.views = (existing.views || 0) + 1;
      } else if (type === 'add_to_cart') {
        updates.add_to_cart = (existing.add_to_cart || 0) + 1;
      } else if (type === 'purchase') {
        updates.purchases = (existing.purchases || 0) + 1;
        if (revenue) {
          updates.revenue = (existing.revenue || 0) + revenue;
        }
      }

      await (supabase as any)
        .from('product_performance_stats')
        .update(updates)
        .eq('id', existing.id);
    } else {
      await (supabase as any)
        .from('product_performance_stats')
        .insert({
          product_id: productId,
          date: today,
          views: type === 'view' ? 1 : 0,
          add_to_cart: type === 'add_to_cart' ? 1 : 0,
          purchases: type === 'purchase' ? 1 : 0,
          revenue: type === 'purchase' && revenue ? revenue : 0
        });
    }
  } catch {
    // Fire-and-forget: never throw from analytics
    console.debug('Product analytics tracking skipped');
  }
};
