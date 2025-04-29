"use client";
import { get } from "@/client/api-client";

import { useQuery } from "@tanstack/react-query";
import { CustomerTable } from "./_components/customer-table";


export function Page() {
  const {data:data , isLoading} = useQuery({queryKey:['customers'],queryFn:() => get('/customers')})
  // console.log("data", data);

  return (
    <div className="">
      {
        isLoading ? <div className="flex justify-center items-center h-screen">Loading...</div> : 
        <CustomerTable data={data as any} />
      }
      
    </div>
  );
}

export default Page;



