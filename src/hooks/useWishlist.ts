import { safeToastError } from '@/lib/error-handler';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { wishlistService, WishlistItem } from "@/services/wishlist";
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "guest_wishlist";

interface PostgrestError {
  code?: string;
  message?: string;
}

export function useWishlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [guestWishlist, setGuestWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setGuestWishlist(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse guest wishlist", e);
        }
      }
    }
  }, [user]);

  const { data: serverItems = [], isLoading } = useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => (user ? wishlistService.getWishlist(user.id) : []),
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: (productId: string) => {
      if (user) return wishlistService.addToWishlist(user.id, productId);
      return Promise.resolve();
    },
    onSuccess: (_, productId) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["wishlist", user.id] });
      } else {
        const newWishlist = [...guestWishlist, productId];
        setGuestWishlist(newWishlist);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newWishlist));
      }
      toast.success("Added to wishlist");
    },
    onError: (error: PostgrestError) => {
      if (error.code === "23505") {
        toast.info("Already in your wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => {
      if (user) return wishlistService.removeFromWishlist(user.id, productId);
      return Promise.resolve();
    },
    onSuccess: (_, productId) => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["wishlist", user.id] });
      } else {
        const newWishlist = guestWishlist.filter(id => id !== productId);
        setGuestWishlist(newWishlist);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newWishlist));
      }
      toast.success("Removed from wishlist");
    },
    onError: () => {
      toast.error("Failed to remove from wishlist");
    },
  });

  const items: WishlistItem[] = user
    ? serverItems
    : guestWishlist.map(productId => ({
        id: productId,
        product_id: productId,
        user_id: "guest",
        created_at: new Date().toISOString(),
      }));

  const isInWishlist = (productId: string) => {
    if (user) return serverItems.some(item => item.product_id === productId);
    return guestWishlist.includes(productId);
  };

  return {
    items,
    isLoading,
    addToWishlist: (id: string) => addMutation.mutateAsync(id),
    removeFromWishlist: (id: string) => removeMutation.mutateAsync(id),
    isInWishlist,
    fetchWishlist: () => queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] }),
  };
}
