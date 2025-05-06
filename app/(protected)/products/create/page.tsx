"use client";

import { ProductForm }  from "../_components/product-form";

export function Product() {
    return (
      <div className="grid grid-cols-1 gap-8">
        <ProductForm />
      </div>
    );
  }

export default Product;