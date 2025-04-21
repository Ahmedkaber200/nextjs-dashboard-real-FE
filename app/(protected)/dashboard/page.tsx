import LogisticChart from "./_components/bar-char";
import { CustomerChart } from "./_components/pie-chart";
import { AreaCharts } from "./_components/area-chart";

export function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <LogisticChart />
      <CustomerChart />
      <AreaCharts />
    </div>
  );
}

export default Home;
