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
import { EditIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { toast } from "sonner";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

// 🔸 Custom hook to delete a product
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  const deleteProductApi = async (id: number) => {
    const res = await del(`/products/${id}`);
    toast.success("Product deleted successfully!");
    return res;
  };

  return useMutation({
    mutationFn: deleteProductApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      toast.error("Failed to delete product.");
      console.error("Error deleting product:", error);
    },
  });
}

// 🔸 Table Component
export function ProductTable({ data }: { data: Product[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search state
  const pageSize = 5;

    // ✅ Search filter
  const filteredData = data.filter((product) =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
   const paginatedData = filteredData.slice(startIndex, endIndex);

  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const confirmDelete = () => {
    if (selectedId !== null) {
      deleteProduct(selectedId, {
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
      {/* ✅ Search Input */}
      <div className="flex justify-between items-center mb-4">
        <Input
          type="text"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="max-w-sm"
        />

        <Button
          variant="primary"
          onClick={() => router.push("/products/create")}
        >
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
          {paginatedData?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>
                <div className="flex justify-start gap-2">
                  {/* Edit Button */}
                  <Link
                    className={cn(
                      buttonVariants({ variant: "success", size: "icon" })
                    )}
                    href={`/products/${item.id}`}
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
          ))}
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

      {/* Delete Confirmation Modal */}
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
