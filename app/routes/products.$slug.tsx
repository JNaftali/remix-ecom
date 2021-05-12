import { useLocation } from "react-router-dom";
import { Form, LoaderFunction, redirect, useRouteData } from "remix";
import { getProductBySlug } from "../db/products";
import { ClientOnly } from "../utils";
import type { Response } from "node-fetch";

export function loader({ params }: Parameters<LoaderFunction>[0]) {
   const product = getProductBySlug(params.slug);

   if (!product) return redirect("/");

   return {
      product,
   };
}

export default function ProductDetailPage() {
   const { product } =
      useRouteData<Exclude<ReturnType<typeof loader>, Response>>();
   const location = useLocation();

   return (
      <main>
         <h1>{product.name}</h1>
         <Form method="post" action="/cart/add" replace>
            <input type="hidden" name="sku" value={product.variants[0].sku} />
            <ClientOnly>
               <input type="hidden" name="redirect" value={location.pathname} />
            </ClientOnly>
            <button>Add to cart</button>
         </Form>
      </main>
   );
}
