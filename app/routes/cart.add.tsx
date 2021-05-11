import { ActionFunction, redirect } from "remix";
import { withCart } from "../cart";
import { getVariantBySku } from "../db/products";

export let action: ActionFunction = async ({ request }) => {
   return withCart(request, async (cart) => {
      const data = new URLSearchParams(await request.text());
      const variantSku = data.get("sku");
      if (variantSku && getVariantBySku(variantSku)) {
         const lines = cart.lines;
         const currentLine = lines.find((l) => l.sku === variantSku) ?? {
            sku: variantSku,
            quantity: 0,
         };
         currentLine.quantity += 1;
         if (!lines.includes(currentLine)) lines.push(currentLine);
         cart.lines = lines;
      }

      return redirect(data.get("redirect") ?? "/cart");
   });
};

export default () => null;
