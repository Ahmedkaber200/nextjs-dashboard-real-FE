'use client';
import LogisticChart from "./_components/bar-char";
import { CustomerChart } from "./_components/pie-chart";
import { AreaCharts } from "./_components/area-chart";
import { get } from "@/client/api-client";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from 'cookies-next'; // Correct method to get cookie on client

export function Home() {
    // const { data, isLoading } = useQuery({
    //   queryKey: ['customers'],
    //   queryFn: () => get('/customers'),
    // });
  
  return (
    <div className="grid grid-cols-3 gap-8">  
      asdsdadadsasd
      {/* <LogisticChart />
      <CustomerChart />
      <AreaCharts /> */}
    </div>
  );
}

export default Home;
