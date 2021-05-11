import { Link, useRouteData } from "remix";
import { getAllProducts } from "../db/products";

export function loader() {
   return {
      products: getAllProducts(),
   };
}

export default function ProductGridPage() {
   const { products } = useRouteData<ReturnType<typeof loader>>();
   return (
      <main>
         <h1>See all our products</h1>
         <ul>
            {products.map((p) => (
               <li>
                  <Link to={p.slug}>{p.name}</Link>
               </li>
            ))}
         </ul>
      </main>
   );
}
