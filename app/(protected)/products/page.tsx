"use client";
import { get } from "@/client/api-client";

import { useQuery } from "@tanstack/react-query";
import { ProductTable } from "./_components/product-table";


export function Page() {
  const {data:data , isLoading} = useQuery({queryKey:['products'],queryFn:() => get('/products')})
  console.log("data", data);

  return (
    <div className="">
      {
        isLoading ? <div className="flex justify-center items-center h-screen">Loading...</div> : 
        <ProductTable data={data as any} />
      }
    </div>
  );
}

export default Page;



