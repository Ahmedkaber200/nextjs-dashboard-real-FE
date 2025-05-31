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

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const deleteCustomerApi = async (id: number) => {
    console.log("Deleting customer with ID:", id);

    const res = await del(`/products/${id}`);
    
    console.log('Product deleted successfully:', res);
    return res;
  };

  return useMutation({
    mutationFn: deleteCustomerApi,
    onSuccess: () => {
      console.log('Invalidating products list...');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
    },
  });
}

export function ProductTable({ data }: { data: Product[] }) {
   console.log("data", data);
  const router = useRouter();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const handleEdit = (id: number) => {
    router.push(`/products/${id}`);
    console.log("Edit product with ID:", id);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => router.push("/products/create")}>
          Create
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your products.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <div className="flex justify-start gap-2">
                  <Button variant="outline" onClick={() => handleEdit(item.id)}>
                    Edit
                  </Button>

                  <Button variant="outline" onClick={() => deleteProduct(item.id)}>
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
