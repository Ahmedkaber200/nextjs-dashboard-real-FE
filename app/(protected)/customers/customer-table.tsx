import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Customer {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
}

export function CustomerTable({ data }: { data: Customer[] }) {
  const handleEdit = (id: number) => {
    console.log("Edit customer with ID:", id);
  };

  const handleDelete = (id: number) => {
    console.log("Delete customer with ID:", id);
  };

  const router = useRouter();

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => router.push("/customers/create")}>
          Create
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.contact}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>
                <div className="flex justify-start gap-2">
                  <Button variant="outline" onClick={() => handleEdit(item.id)}>
                    Edit
                  </Button>

                  <Button variant="outline" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                  </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
