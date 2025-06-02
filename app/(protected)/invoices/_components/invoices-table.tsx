// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { del } from "@/client/api-client";
// import { useEffect } from "react";
// import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"

// interface Invoice {
//   id: number;
//   customer_id: number;
//   total_amount: number;
//   status: string;
//   date: string;
//   products: Array<{ id: number; name: string; price: number }>;
//   customer: {
//     name: string;
//   };
// }

// export function useDeleteInvoice() {
//   const queryClient = useQueryClient();

//   const deleteInvoiceApi = async (id: number) => {
//     console.log("Deleting invoice with ID:", id);
//     const res = await del(`/invoices/${id}`);
//     return res;
//   };

//   return useMutation({
//     mutationFn: deleteInvoiceApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["invoices"] });
//     },
//     onError: (error) => {
//       console.error("Error deleting invoice:", error);
//     },
//   });
// }

// export function InvoiceTable({ data }: { data: Invoice[] }) {
//   const router = useRouter();
//   const { mutate: deleteInvoice, isPending } = useDeleteInvoice();

//   const handleEdit = (id: number) => {
//     router.push(`/invoices/${id}`);
//   };
//   useEffect(() => {
//     console.log("data", data);
//   }, [data]);
//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <Button
//           variant="outline"
//           onClick={() => router.push("/invoices/create")}
//         >
//           Create Invoice
//         </Button>
//       </div>

//       <Table>
//         <TableCaption>A list of your invoices.</TableCaption>

//         <TableHeader>
//           <TableRow>
//             <TableHead>Customer</TableHead>
//             <TableHead>Total</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead>Products</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//         <TableBody>
//           {data?.map((item) => (
//             <TableRow key={item.id}>
//               <TableCell className="font-medium">
//                 {item.customer?.name}
//               </TableCell>
//               <TableCell>{item.total_amount}</TableCell>
//               <TableCell>{item.status}</TableCell>
//               <TableCell>{item.date}</TableCell>
//               <TableCell>{item.products?.length || 0}</TableCell>
//               <TableCell>

//           </CollapsibleContent>
//           </Collapsible>
//           <Collapsible>
//             <TableRow>
//               <TableCell>
//                 <CollapsibleTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <ChevronDownIcon className="h-4 w-4" />
//                   </Button>
//                 </CollapsibleTrigger>
//               </TableCell>
//               <TableCell className="font-medium">Jane Smith</TableCell>
//               <TableCell>jane.smith@example.com</TableCell>
//               <TableCell>Editor</TableCell>
//             </TableRow>
//             <CollapsibleContent>
//               <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-b-lg">
//                 <div className="grid gap-2">
//                   <div>
//                     <h4 className="font-medium">About</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Jane is a talented content editor with a keen eye for detail.
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium">Contact</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Phone: 555-5678
//                       <br />
//                       Email: jane.smith@example.com
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>
//           <Collapsible>
//             <TableRow>
//               <TableCell>
//                 <CollapsibleTrigger asChild>
//                   <Button variant="ghost" size="icon">
//                     <ChevronDownIcon className="h-4 w-4" />
//                   </Button>
//                 </CollapsibleTrigger>
//               </TableCell>
//               <TableCell className="font-medium">Bob Johnson</TableCell>
//               <TableCell>bob.johnson@example.com</TableCell>
//               <TableCell>User</TableCell>
//             </TableRow>
//             <CollapsibleContent>
//               <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-b-lg">
//                 <div className="grid gap-2">
//                   <div>
//                     <h4 className="font-medium">About</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Bob is a regular user who enjoys using our platform.
//                     </p>
//                   </div>
//                   <div>
//                     <h4 className="font-medium">Contact</h4>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Phone: 555-9012
//                       <br />
//                       Email: bob.johnson@example.com
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CollapsibleContent>
//           </Collapsible>

//                 <div className="flex gap-2">
//                   <Button variant="outline" onClick={() => handleEdit(item.id)}>
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={() => deleteInvoice(item.id)}
//                     disabled={isPending}
//                   >
//                     {isPending ? "Deleting..." : "Delete"}
//                   </Button>
//                 </div>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }


// "use client";

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { del } from "@/client/api-client";
// import { useEffect, useState } from "react";
// import {
//   Collapsible,
//   CollapsibleTrigger,
//   CollapsibleContent,
// } from "@/components/ui/collapsible";
// import { ChevronDownIcon } from "@radix-ui/react-icons";

// interface Invoice {
//   id: number;
//   customer_id: number;
//   total_amount: number;
//   status: string;
//   date: string;
//   products: Array<{ id: number; name: string; price: number }>;
//   customer: {
//     name: string;
//   };
// }

// export function useDeleteInvoice() {
//   const queryClient = useQueryClient();

//   const deleteInvoiceApi = async (id: number) => {
//     const res = await del(`/invoices/${id}`);
//     return res;
//   };

//   return useMutation({
//     mutationFn: deleteInvoiceApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["invoices"] });
//     },
//     onError: (error) => {
//       console.error("Error deleting invoice:", error);
//     },
//   });
// }

// export function InvoiceTable({ data }: { data: Invoice[] }) {
//   const router = useRouter();
//   const { mutate: deleteInvoice, isPending } = useDeleteInvoice();
//   const [openRow, setOpenRow] = useState<number | null>(null);

//   const handleEdit = (id: number) => {
//     router.push(`/invoices/${id}`);
//   };

//   return (
//     <div>
//       <div className="flex justify-end mb-4">
//         <Button variant="outline" onClick={() => router.push("/invoices/create")}>
//           Create Invoice
//         </Button>
//       </div>

//       <Table>
//         <TableCaption>A list of your invoices.</TableCaption>

//         <TableHeader>
//           <TableRow>
//             <TableHead />
//             <TableHead>Customer</TableHead>
//             <TableHead>Total</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Date</TableHead>
//             <TableHead>Products</TableHead>
//             <TableHead>Actions</TableHead>
//           </TableRow>
//         </TableHeader>

//  <TableBody>
//   {data?.map((item) => (
//     <Collapsible
//       key={item.id}
//       open={openRow === item.id}
//       onOpenChange={() =>
//         setOpenRow(openRow === item.id ? null : item.id)
//       }
//     >
//       {/* Main Row */}
//       <TableRow>
//         <TableCell>
//           <CollapsibleTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <ChevronDownIcon className="h-4 w-4" />
//             </Button>
//           </CollapsibleTrigger>
//         </TableCell>
//         <TableCell>{item.customer?.name}</TableCell>
//         <TableCell>{item.total_amount}</TableCell>
//         <TableCell>{item.status}</TableCell>
//         <TableCell>{item.date}</TableCell>
//         <TableCell>{item.products?.length || 0}</TableCell>
//         <TableCell>
//           <div className="flex gap-2">
//             <Button variant="outline" onClick={() => handleEdit(item.id)}>
//               Edit
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => deleteInvoice(item.id)}
//               disabled={isPending}
//             >
//               {isPending ? "Deleting..." : "Delete"}
//             </Button>
//           </div>
//         </TableCell>
//       </TableRow>

//       {/* Collapsible Row Below */}
//       <CollapsibleContent asChild>
//         <TableRow>
//           <TableCell />
//           <TableCell>
//             <div className="text-sm text-muted-foreground">
//               {item.customer?.name}
//             </div>
//           </TableCell>
//           <TableCell>
//             <div className="text-sm text-muted-foreground">
//               ${item.total_amount}
//             </div>
//           </TableCell>
//           <TableCell>
//             <div className="text-sm text-muted-foreground">{item.status}</div>
//           </TableCell>
//           <TableCell>
//             <div className="text-sm text-muted-foreground">{item.date}</div>
//           </TableCell>
//           <TableCell>
//             <ul className="list-disc pl-4 text-sm text-muted-foreground">
//               {item.products?.map((product) => (
//                 <li key={product.id}>
//                   {product.name} – ${product.price}
//                 </li>
//               ))}
//             </ul>
//           </TableCell>
//           <TableCell>
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => handleEdit(item.id)}>
//                 Edit
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => deleteInvoice(item.id)}
//                 disabled={isPending}
//               >
//                 {isPending ? "Deleting..." : "Delete"}
//               </Button>
//             </div>
//           </TableCell>
//         </TableRow>
//       </CollapsibleContent>
//     </Collapsible>
//   ))}
// </TableBody>


//       </Table>
//     </div>
//   );
// }
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { del } from "@/client/api-client";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDownIcon } from "@radix-ui/react-icons";

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
            <Collapsible key={item.id} open={openRows.includes(item.id)}>
              <TableRow>
                <TableCell className="font-medium">{item.customer?.name}</TableCell>
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
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/invoices/${item.id}`)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => deleteInvoice(item.id)}
                      disabled={isPending}
                    >
                      {isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              <CollapsibleContent>
                <TableRow>
                  <TableCell colSpan={6} className="bg-gray-50 dark:bg-gray-900">
                    <div className="p-4 space-y-2">
                      <h4 className="font-semibold mb-2">Products</h4>
                      {item.products.map((product) => (
                        <div
                          key={product.id}
                          className="border p-2 rounded bg-white dark:bg-gray-800"
                        >
                          <p><strong>ID:</strong> {product.id}</p>
                          <p><strong>Name:</strong> {product.name}</p>
                          <p><strong>Price:</strong> ${product.price}</p>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
