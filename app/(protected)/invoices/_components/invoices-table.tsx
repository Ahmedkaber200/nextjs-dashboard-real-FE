"use client";

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
import { useState } from "react";
import React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EditIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

// ======================
// 🔸 Type Definitions
// ======================
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

// ======================
// 🔸 Delete Hook
// ======================
export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  const deleteInvoiceApi = async (id: number) => {
    const res = await del(`/invoices/${id}`);
    toast.success("Invoice deleted successfully!");
    return res;
  };

  return useMutation({
    mutationFn: deleteInvoiceApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (error) => {
      toast.error("Failed to delete invoice.");
      console.error("Error deleting invoice:", error);
    },
  });
}

// ======================
// 🔸 Invoice Table Component
// ======================
export function InvoiceTable({ data }: { data: Invoice[] }) {
  const router = useRouter();
  const [openRows, setOpenRows] = useState<number[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const { mutate: deleteInvoice, isPending } = useDeleteInvoice();

  // 🔸 Expand Row Toggle
  const toggleRow = (id: number) => {
    setOpenRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // 🔸 Confirm Deletion
  const confirmDelete = () => {
    if (selectedId !== null) {
      deleteInvoice(selectedId, {
        onSuccess: () => {
          setSelectedId(null);
          setIsModalOpen(false);
        },
        onError: () => {
          setSelectedId(null);
          setIsModalOpen(false);
        },
      });
    }
  };

  return (
    <div>
      {/* 🔹 Header Action */}
      <div className="flex justify-end mb-4">
        <Button
          variant="primary"
          onClick={() => router.push("/invoices/create")}
        >
          Create Invoice
        </Button>
      </div>

      {/* 🔹 Table */}
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
          {paginatedData?.map((item) => {
            const isOpen = openRows.includes(item.id);
            return (
              <React.Fragment key={item.id}>
                <TableRow>
                  <TableCell>{item.customer?.name}</TableCell>
                  <TableCell>{item.total_amount}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    {item.products.length}
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
                      {/* Edit Button */}
                      <Link
                        className={cn(
                          buttonVariants({ variant: "success", size: "icon" })
                        )}
                        href={`/invoices/${item.id}`}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Link>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="icon"
                        disabled={selectedId === item.id && isPending}
                        onClick={() => {
                          setSelectedId(item.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Expanded Row: Products */}
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

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>

          {Array.from({ length: Math.ceil(data.length / pageSize) }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(data.length / pageSize))
                )
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* 🔹 Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
}
