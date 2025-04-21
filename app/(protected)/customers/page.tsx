"use client";
import { get } from "@/client/api-client";
import { CustomerTable } from "./customer-table";
import { useQuery } from "@tanstack/react-query";

export  function Page() {
  const {data:data , isLoading} = useQuery({queryKey:['customers'],queryFn:() => get('/customers')})

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



