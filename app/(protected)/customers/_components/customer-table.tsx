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
import { toast } from "sonner";
import { useState } from "react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface Customer {
  id: number;
  name: string;
  email: string;
  contact: string;
  address: string;
}

export function CustomerTable({ data }: { data: Customer[] }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // Delete mutation
  const { mutate: deleteCustomer, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const res = await del(`/customers/${id}`);
      toast.success("Customer deleted successfully!");
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setIsModalOpen(false);
      setSelectedId(null);
    },
    onError: () => {
      toast.error("Failed to delete customer.");
    },
  });

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);       
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedId !== null) {
      deleteCustomer(selectedId);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" onClick={() => router.push("/customers/create")}>
          Create Customer
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
                  <Link
                    href={`/customers/${item.id}`}
                    className={cn(buttonVariants({ variant: "success", size: "icon" }))}
                  >
                    <EditIcon className="h-4 w-4" />
                  </Link>

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