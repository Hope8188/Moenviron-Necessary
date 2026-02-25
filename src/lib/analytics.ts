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

export const trackProductInteraction = async (
  productId: string, 
  type: ProductInteractionType, 
  productName?: string,
  revenue?: number
) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if a record exists for this product and date
    const { data: existing, error: fetchError } = await supabase
      .from('product_performance_stats')
      .select('*')
      .eq('product_id', productId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking product stats:', fetchError);
      return;
    }

    if (existing) {
      // Update existing record
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

      const { error: updateError } = await supabase
        .from('product_performance_stats')
        .update(updates)
        .eq('id', existing.id);

      if (updateError) {
        console.error('Error updating product stats:', updateError);
      }
    } else {
      // Insert new record
      const newRecord: {
        product_id: string;
        date: string;
        views: number;
        add_to_cart: number;
        purchases: number;
        revenue: number;
      } = {
        product_id: productId,
        date: today,
        views: type === 'view' ? 1 : 0,
        add_to_cart: type === 'add_to_cart' ? 1 : 0,
        purchases: type === 'purchase' ? 1 : 0,
        revenue: type === 'purchase' && revenue ? revenue : 0
      };

      const { error: insertError } = await supabase
        .from('product_performance_stats')
        .insert(newRecord);

      if (insertError) {
        console.error('Error inserting product stats:', insertError);
      }
    }
  } catch (err) {
    console.error(`Unexpected error tracking product ${type}:`, err);
  }
};
