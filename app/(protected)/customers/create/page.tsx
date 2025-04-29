"use client";

import { CustomerForm }  from "../_components/customer-form";

export function Customer() {
    return (
      <div className="grid grid-cols-1 gap-8">
        <CustomerForm />
      </div>
    );
  }

export default Customer;