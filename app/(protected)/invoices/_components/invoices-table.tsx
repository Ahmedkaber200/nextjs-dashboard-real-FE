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

interface Invoice {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
  date: string;
  product_details: {
    products: { id: number; name: string; price: number }[];
  };
  customer: {
    name: string;
  };
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  const deleteInvoiceApi = async (id: number) => {
    console.log("Deleting invoice with ID:", id);
    const res = await del(`/invoices/${id}`);
    return res;
  };

  return useMutation({
    mutationFn: deleteInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error('Error deleting invoice:', error);
    },
  });
}

export function InvoiceTable({ data }: { data: Invoice[] }) {
    console.log("data", data);
  const router = useRouter();
  const { mutate: deleteInvoice, isPending } = useDeleteInvoice();

  const handleEdit = (id: number) => {
    router.push(`/invoices/${id}`);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => router.push("/invoices/create")}>
          Create Invoice
        </Button>
      </div>

      <Table>
        <TableCaption>A list of your invoices.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.customer?.name}</TableCell>
              <TableCell>{item.total_amount}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.product_details?.products?.length || 0}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(item.id)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => deleteInvoice(item.id)}
                    disabled={isPending}
                  >
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
