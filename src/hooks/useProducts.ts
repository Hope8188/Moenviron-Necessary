import { useQuery } from "@tanstack/react-query";
import { productService, Product } from "@/services/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await productService.getProducts();
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  });
}
