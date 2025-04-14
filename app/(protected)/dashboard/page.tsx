import LogisticChart from "./_components/bar-char";
import { CustomerChart } from "./_components/customer-chart";

export function Home() {
  return (
    <div className="grid grid-cols-3 gap-8">
      <LogisticChart />
      <CustomerChart />
    </div>
  );
}

export default Home;
