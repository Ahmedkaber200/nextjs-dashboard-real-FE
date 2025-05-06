"use client";
import { useQuery } from "@tanstack/react-query";
import { ProductForm } from "../_components/product-form";
import { useParams } from "next/navigation";
import { get } from "@/client/api-client";

export function EditProduct() {
  const productId = useParams()?.id as string;

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["product", productId],
    queryFn: () => get(`/products/${productId}`),
    enabled: !!productId,
  });

  return (
    <div className="grid grid-cols-1 gap-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      ) : (
        <ProductForm initialData={data as any} mode="edit" />
      )}
    </div>
  );
}

export default EditProduct;