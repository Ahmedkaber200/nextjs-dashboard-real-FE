"use client";

import { InvoiceForm }  from "../_components/invoice-form";

export function Invoice() {
    return (
      <div className="grid grid-cols-1 gap-8">
        <InvoiceForm />
      </div>
    );
  }

export default Invoice;