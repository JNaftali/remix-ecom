import type { LinksFunction } from "remix";
import { Meta, Links, Scripts, LiveReload } from "remix";
import { NavLink, Outlet } from "react-router-dom";

import stylesUrl from "./styles/global.css";
import MiniCart from "./components/MiniCart";

export let links: LinksFunction = (_arg) => {
   return [{ rel: "stylesheet", href: stylesUrl }, ...MiniCart.links(_arg)];
};

function Document({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <head>
            <meta charSet="utf-8" />
            <link rel="icon" href="/favicon.png" type="image/png" />
            <Meta />
            <Links />
         </head>
         <body>
            {children}

            <Scripts />
            {process.env.NODE_ENV === "development" && <LiveReload />}
         </body>
      </html>
   );
}

export default function App() {
   return (
      <Document>
         <nav>
            <ul>
               <li>
                  <NavLink to="/products">Grid</NavLink>
               </li>
               <li>
                  <MiniCart />
               </li>
            </ul>
         </nav>
         <Outlet />
      </Document>
   );
}

export function ErrorBoundary({ error }: { error: Error }) {
   return (
      <Document>
         <h1>App Error</h1>
         <pre>{error.message}</pre>
         <p>
            Replace this UI with what you want users to see when your app throws
            uncaught errors.
         </p>
      </Document>
   );
}
