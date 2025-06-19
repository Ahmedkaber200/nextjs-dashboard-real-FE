import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { del } from "@/client/api-client";
import { DeleteIcon, EditIcon, Trash2 } from "lucide-react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        <Button variant="primary" onClick={() => router.push("/products/create")}>
          Create Product
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

                   <Link
                      className={
                        cn(
                          buttonVariants({ variant: "success" , size: "icon" }),
                        )
                      }
                        href={`/products/${item.id}`}
                    
                      >
                        <EditIcon className="h-4 w-4" /> 
                    </Link>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteProduct(item.id)}
                      
                    >
                      <Trash2 className="h-4 w-4 text-white" />
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
