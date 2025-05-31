import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { del } from "@/client/api-client";

interface Customer {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  const deleteCustomerApi = async (id: number) => {
    console.log("Deleting customer with ID:", id);

    const res = await del(`/customers/${id}`);
    
    console.log('Customer deleted successfully:', res);
    return res;
  };

  return useMutation({
    mutationFn: deleteCustomerApi,
    onSuccess: () => {
      console.log('Invalidating customers list...');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
    },
  });
}

export function CustomerTable({ data }: { data: Customer[] }) {
  console.log("data", data);
  const router = useRouter();
  const { mutate: deleteCustomer, isPending } = useDeleteCustomer();

  const handleEdit = (id: number) => {
    router.push(`/customers/${id}`);
    console.log("Edit customer with ID:", id);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => router.push("/customers/create")}>
          Create
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your customers.</TableCaption>

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

                  <Button variant="outline" onClick={() => deleteCustomer(item.id)}>
                    {isPending ? 'Deleting...' : 'Delete'}
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
