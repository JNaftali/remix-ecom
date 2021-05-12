import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsClient } from "../utils";
import type { AppData as CartData } from "../routes/cart";
import Dialog from "@reach/dialog";
import { Form, LinksFunction } from "remix";

function MiniCart() {
   const cart = useCartData();
   const [isModalOpen, setModalOpen] = useState(false);
   const location = useLocation();

   if (!useIsClient() || !cart) {
      return <Link to="/cart">Cart</Link>;
   }

   return (
      <>
         <button onClick={() => setModalOpen(true)}>Cart ({cart.count})</button>
         {isModalOpen && (
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
               <button onClick={() => setModalOpen(false)}>close</button>
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
