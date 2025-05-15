"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Check, FileText, User, Package, AlertCircle } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Icons } from "@/components/ui/icons"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

// Import API client from the correct location
import { post, put } from "@/client/api-client"

const frameworksList = [
  {
    value: "next.js",
    label: "Next.js",
    icon: Icons.dog,
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
    icon: Icons.cat,
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
    icon: Icons.turtle,
  },
  {
    value: "remix",
    label: "Remix",
    icon: Icons.rabbit,
  },
  {
    value: "astro",
    label: "Astro",
    icon: Icons.fish,
  },
]

const formSchema = z.object({
  customer_name: z.string().min(2, { message: "Customer name is required" }),
  product_details: z.any().refine((val) => val.length > 0, { message: "At least one product is required" }),
  status: z.string().min(1, { message: "Status is required" }),
})

type InvoiceFormProps = {
  mode?: "create" | "edit"
  initialData?: {
    id?: number
    customer_name: string
    product_details: string
    status: string
  }
}

export function InvoiceForm({ mode = "create", initialData }: InvoiceFormProps) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      product_details: "",
      status: "",
    },
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      form.reset(initialData)
    }
  }, [mode, initialData, form])

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      try {
        if (mode === "create") {
          return await post("/invoices", data)
        } else {
          return await put(`/invoices/${initialData?.id}`, data)
        }
      } catch (error) {
        console.error(`Failed to ${mode} invoice:`, error)
        throw error
      }
    },
    onSuccess: () => {
      form.reset()
      router.push("/invoices")
      router.refresh()
    },
    onError: (error) => {
      console.error(`Failed to ${mode} invoice:`, error)
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values)
  }

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
            Fill in the details below to {mode === "create" ? "create a new" : "update the"} invoice
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Customer Name */}
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Customer Name
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full h-12 rounded-lg border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-80">
                        <div className="p-2 border-b">
                          <Badge variant="outline" className="w-full justify-start text-xs font-normal py-1 px-2">
                            Select a customer
                          </Badge>
                        </div>
                        <SelectItem value="Ali" className="py-3 cursor-pointer">
                          Ali
                        </SelectItem>
                        <SelectItem value="Asad" className="py-3 cursor-pointer">
                          Asad
                        </SelectItem>
                        <SelectItem value="Hamza" className="py-3 cursor-pointer">
                          Hamza
                        </SelectItem>
                        <SelectItem value="Fahad" className="py-3 cursor-pointer">
                          Fahad
                        </SelectItem>
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
                        options={frameworksList}
                        onValueChange={field.onChange}
                        placeholder="Select products"
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
                            <RadioGroupItem value="pending" id="pending" className="peer sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor="pending"
                            className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="flex flex-col gap-1">
                              <span>Pending</span>
                              <span className="text-xs text-muted-foreground">Awaiting payment</span>
                            </div>
                            <Check className="h-5 w-5 text-primary opacity-0 peer-data-[state=checked]:opacity-100" />
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex">
                          <FormControl>
                            <RadioGroupItem value="paid" id="paid" className="peer sr-only" />
                          </FormControl>
                          <FormLabel
                            htmlFor="paid"
                            className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <div className="flex flex-col gap-1">
                              <span>Paid</span>
                              <span className="text-xs text-muted-foreground">Payment received</span>
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

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-end">
                <Button
                  isLoading={isPending}
                  type="submit"
                  className="w-36 h-12 text-base font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
             
                >
                  { mode === "create" ? (
                    "Create Invoice"
                  ) : (
                    "Update Invoice"
                  )}
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
  )
}
