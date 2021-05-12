import { useRouteData, LoaderFunctionArg, InferLoaderBody, Form } from "remix";
import { withCart } from "../cart";
import { getVariantBySku } from "../db/products";

export async function loader({ request }: LoaderFunctionArg) {
   return withCart(request, async (cart) => {
      return {
         lines: cart.lines.map((line) => ({
            ...line,
            // We're comfortable asserting that this exists because
            // We verify that a variant exists before adding it to the cart
            variant: getVariantBySku(line.sku)!,
         })),
         count: cart.lines.reduce((total, line) => total + line.quantity, 0),
      };
   });
}

export type AppData = InferLoaderBody<typeof loader>;

export default function CartPage() {
   const { lines } = useRouteData<AppData>();
   return (
      <ul>
         {lines.map((line) => (
            <li key={line.sku}>
               {line.variant.product.name} ({line.variant.name}):{" "}
               {line.quantity}{" "}
               <Form method="post" action="/cart/remove">
                  <input type="hidden" name="sku" value={line.sku} />
                  <button>remove from cart</button>
               </Form>
            </li>
         ))}
      </ul>
   );
}
