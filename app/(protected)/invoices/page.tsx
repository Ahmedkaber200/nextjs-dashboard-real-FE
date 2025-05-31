"use client";
import { get } from "@/client/api-client";

import { useQuery } from "@tanstack/react-query";
import { InvoiceTable } from "./_components/invoices-table";


export function Invoice() {
  const {data:data , isLoading} = useQuery({queryKey:['invoices'],queryFn:() => get('/invoices')})
  console.log("data", data);

  return (
    <div className="">
      {
        isLoading ? <div className="flex justify-center items-center h-screen">Loading...</div> : 
        <InvoiceTable data={data as any} />
      }
    </div>
  );
}

export default Invoice;



