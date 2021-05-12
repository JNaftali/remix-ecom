import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsClient } from "../utils";
import type { AppData as CartData } from "../routes/cart";
import Dialog from "@reach/dialog";
import { Form, LinksFunction, usePendingFormSubmit } from "remix";

function MiniCart() {
   const cart = useCartData();
   const [cartIsOpen, setCartIsOpen] = useState(false);
   const toggleMiniCart: ToggleCartFunction = (isOpen) => {
      if (typeof isOpen === "boolean") setCartIsOpen(isOpen);
      else setCartIsOpen((x) => !x);
   };

   useOpenMiniCartWhenAddingToCart(toggleMiniCart);
   const location = useLocation();

   if (!useIsClient() || !cart) {
      return <Link to="/cart">Cart</Link>;
   }

   return (
      <>
         <button onClick={() => toggleMiniCart()}>Cart ({cart.count})</button>
         {cartIsOpen && (
            <Dialog aria-label="Mini cart">
               {cart.lines.length ? (
                  <ul>
                     {cart.lines.map((line) => (
                        <li key={line.sku}>
                           {line.variant.product.name} ({line.variant.name}):{" "}
                           {line.quantity}{" "}
                           <Form method="post" action="/cart/remove">
                              <input
                                 type="hidden"
                                 name="sku"
                                 value={line.sku}
                              />
                              <input
                                 type="hidden"
                                 name="redirect"
                                 value={location.pathname}
                              />
                              <button>remove from cart</button>
                           </Form>
                        </li>
                     ))}
                  </ul>
               ) : (
                  <span>Cart is empty :(</span>
               )}
               <button onClick={() => toggleMiniCart(false)}>close</button>
            </Dialog>
         )}
      </>
   );
}

let links: LinksFunction = () => {
   return [
      {
         rel: "stylesheet",
         href: "https://unpkg.com/@reach/dialog@0.15.0/styles.css",
      },
   ];
};

MiniCart.links = links;

function useCartData() {
   const [data, setData] = useState<CartData>();
   const location = useLocation();
   useEffect(() => {
      (async () => {
         let response = await fetch("/cart?_data=routes/cart");
         setData(await response.json());
      })();
   }, [location]);

   return data;
}

export default MiniCart;

interface ToggleCartFunction {
   (isOpen?: boolean): void;
}

function useOpenMiniCartWhenAddingToCart(toggleMiniCart: ToggleCartFunction) {
   const pendingForm = usePendingFormSubmit();
   useEffect(() => {
      if (pendingForm && pendingForm.action.endsWith("/cart/add")) {
         toggleMiniCart(true);
      }
   }, [pendingForm]);
}
