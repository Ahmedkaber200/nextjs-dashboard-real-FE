"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, FileText, User, Package, AlertCircle } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Icons } from "@/components/ui/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

// Import API client from the correct location
import { post, put, get } from "@/client/api-client";
import { useStore } from "@/app/hooks/usestore";

// const frameworksList = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ];

const formSchema = z.object({
  customer_id: z.coerce.number().min(1, { message: "Customer is required" }),

  // customer_id: z.string().min(2, { message: "Customer name is required" }),
  product_details: z.any().refine((val) => val.length > 0, {
    message: "At least one product is required",
  }),
  status: z.string().min(1, { message: "Status is required" }),
});

type InvoiceFormProps = {
  mode?: "create" | "edit";
  initialData?: {
    id?: number;
    customer_id: number;
    product_details: Array<{
      id: number;
      name: string;
      price: number;
    }>;
    total_amount?: number;
    status: "pending" | "paid";
    // total_amount: number;
  };
};

export function InvoiceForm({
  mode = "create",
  initialData,
}: InvoiceFormProps) {
  const router = useRouter();
  const { customers } = useStore();

  const { data: products = [], isPending: loading } = useQuery({
    queryKey: ["products"],
    queryFn: () => get("/products"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_id: 0,
      product_details: [],
      status: "",
    },
  });

  // useEffect(() => {
  //   if (mode === "edit" && initialData) {
  //     form.reset(initialData);
  //   }
  // }, [mode, initialData, form]);

  // const { mutate, isPending } = useMutation({
  //   mutationFn: async (data: z.infer<typeof formSchema>) => {

  //     try {
  //       if (mode === "create") {
  //         return await post("/invoices", data);
  //       } else {
  //         return await put(`/invoices/${initialData?.id}`, data);
  //       }
  //     } catch (error) {
  //       console.error(`Failed to ${mode} invoice:`, error);
  //       throw error;
  //     }
  //   },
  //   onSuccess: () => {
  //     form.reset();
  //     router.push("/invoices");
  //     router.refresh();
  //   },
  //   onError: (error) => {
  //     console.error(`Failed to ${mode} invoice:`, error);
  //   },
  // });

  // Set form values when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset({
        product_details: initialData.product_details,
        status: initialData.status,
      });
    }
  }, [mode, initialData, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      mode === "create"
        ? post("/invoices", data)
        : put(`/invoices/${initialData?.id}`, data),
    onSuccess: () => {
      form.reset();
      router.push("/invoices");
      router.refresh(); // Refresh to show updated data
    },
    onError: (error) => {
      console.error(`Failed to ${mode} invoices:`, error);
    },
  });

  const [total, setTotal] = useState(0);

  function calculateTotal(products: any[]) {
    console.log(products);
    const totalAmount = products.reduce((sum, product) => {
      return sum + (Number(product.price) || 0);
    }, 0);
    setTotal(totalAmount);
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({ ...values, total_amount: total } as any);
  };

  // type Customer = {
  //   id: number;
  //   name: string;
  // };

  return (
    <div className="w-full ">
      <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <CardHeader className="space-y-1 pb-6 pt-8 px-8 border-b">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {mode === "create" ? "Create New Invoice" : "Update Invoice"}
            </CardTitle>
          </div>
          <CardDescription>
            Fill in the details below to{" "}
            {mode === "create" ? "create a new" : "update the"} invoice
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Customer Name */}
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Name
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                      //  onValueChange={field.onChange}
                      //   value={field.value?.toString() || ""}
                      //  onValueChange={(value) => field.onChange(Number(value))}
                      //   value={field.value?.toString()}
                      // onValueChange={field.onChange}
                      // defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-80">
                        {customers?.map((customer: any) => (
                          <SelectItem
                            key={customer.id}
                            value={customer.id.toString()}
                            className="py-3 cursor-pointer"
                          >
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Product Details */}
              <FormField
                control={form.control}
                name="product_details"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Product Details
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={(products as any)?.map((product: any) => ({
                          value: product.id,
                          label: `${product.id} - ${product.name} - Rs ${product.price}`,
                        }))}
                        onValueChange={(values) => {
                          console.log("Selected values:", values);
                          let prod = (products as any)?.filter(
                            (product: any) => values.includes(product.id)
                          ).map((e:any)=>({id: e.id, name: e.name, price: e.price}));
                          calculateTotal(prod);
                          field.onChange(prod);
                        }}
                        placeholder="Select products"
                        /* <MultiSelect
                        options={(products as any)?.map((product: any) => ({
                          value: product.name,
                          label: product.name,
                        }))}
                        onValueChange={field.onChange}
                        placeholder="Select products" */
                        variant="inverted"
                        animation={2}
                        maxCount={3}
                        className="h-12 rounded-lg border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Invoice Status
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                      >
                        <FormItem className="flex">
                          <FormControl>
                            <RadioGroupItem
                              value="pending"
                              id="pending"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="pending"
                            className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="flex flex-col gap-1">
                              <span>Pending</span>
                              <span className="text-xs text-muted-foreground">
                                Awaiting payment
                              </span>
                            </div>
                            <Check className="h-5 w-5 text-primary opacity-0 peer-data-[state=checked]:opacity-100" />
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex">
                          <FormControl>
                            <RadioGroupItem
                              value="paid"
                              id="paid"
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor="paid"
                            className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="flex flex-col gap-1">
                              <span>Paid</span>
                              <span className="text-xs text-muted-foreground">
                                Payment received
                              </span>
                            </div>
                            <Check className="h-5 w-5 text-primary opacity-0 peer-data-[state=checked]:opacity-100" />
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h1 className="text-4xl">{total}</h1>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                <Button
                  isLoading={isPending}
                  type="submit"
                  className="w-36 h-12 text-base font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  {mode === "create" ? "Create Invoice" : "Update Invoice"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-36 h-12 text-base font-medium rounded-lg border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  onClick={() => router.push("/invoices")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
