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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { del } from "@/client/api-client";
import { useEffect, useState } from "react";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DeleteIcon, EditIcon, Trash2 } from "lucide-react";

interface Invoice {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
  date: string;
  products: Array<{ id: number; name: string; price: number }>;
  customer: {
    name: string;
  };
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  const deleteInvoiceApi = async (id: number) => {
    const res = await del(`/invoices/${id}`);
    return res;
  };

  return useMutation({
    mutationFn: deleteInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error) => {
      console.error("Error deleting invoice:", error);
    },
  });
}

export function InvoiceTable({ data }: { data: Invoice[] }) {
  const router = useRouter();
  const { mutate: deleteInvoice, isPending } = useDeleteInvoice();
  const [openRows, setOpenRows] = useState<number[]>([]);

  const toggleRow = (id: number) => {
    setOpenRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => router.push("/invoices/create")}
        >
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
          {data?.map((item) => {
            const isOpen = openRows.includes(item.id);
            return (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell className="font-medium">
                    {item.customer?.name}
                  </TableCell>
                  <TableCell>{item.total_amount}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    {item.products?.length || 0}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRow(item.id)}
                      className="ml-2"
                    >
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link
                      className={
                        cn(
                          buttonVariants({ variant: "success" , size: "icon" }),
                        )
                      }
                        href={`/invoices/${item.id}`}
                    
                      >
                        <EditIcon className="h-4 w-4" /> 
                      </Link>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteInvoice(item.id)}
                        
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {isOpen && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="bg-gray-50 dark:bg-gray-900"
                    >
                      <div className="p-4 space-y-2">
                        <h4 className="font-semibold mb-2">Products</h4>
                        {item.products.map((product) => (
                          <div
                            key={product.id}
                            className="border p-2 rounded bg-white dark:bg-gray-800"
                          >
                            <p>
                              <strong>ID:</strong> {product.id}
                            </p>
                            <p>
                              <strong>Name:</strong> {product.name}
                            </p>
                            <p>
                              <strong>Price:</strong> ${product.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
