"use client";
import { useQuery } from "@tanstack/react-query";
import { InvoiceForm } from "../_components/invoice-form";

import { useParams } from "next/navigation";
import { get } from "@/client/api-client";

export function EditInvoice() {
  const invoiceId = useParams()?.id as string;
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => get(`/invoices/${invoiceId}`),
    enabled: !!invoiceId,
  });

  return (
    <div className="grid grid-cols-1 gap-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      ) : (
        <InvoiceForm initialData={data as any} mode="edit" />
      )}
    </div>
  );
}

export default EditInvoice;
