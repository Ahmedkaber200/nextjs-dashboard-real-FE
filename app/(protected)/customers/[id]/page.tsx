"use client";
import { useQuery } from "@tanstack/react-query";
import { CustomerForm } from "../_components/customer-form";

import { useParams } from "next/navigation";
import { get } from "@/client/api-client";

export function EditCustomer() {
  const customerId = useParams()?.id as string;
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["customer", customerId],
    queryFn: () => get(`/customers/${customerId}`),
    enabled: !!customerId,
  });


  return (
    <div className="grid grid-cols-1 gap-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      ) : (
        <CustomerForm initialData={data as any}
        mode="edit"  />
      )}
    </div>
  );
}

export default EditCustomer;
