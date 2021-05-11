import { ActionFunction, redirect } from "remix";
import { withCart } from "../cart";

export let action: ActionFunction = async ({ request }) => {
   return withCart(request, async (cart) => {
      const data = new URLSearchParams(await request.text());

      const variantSku = data.get("sku");
      if (variantSku) {
         cart.lines = cart.lines.filter((line) => line.sku !== variantSku);
      }

      return redirect(data.get("redirect") ?? "/cart");
   });
};

export default () => null;
