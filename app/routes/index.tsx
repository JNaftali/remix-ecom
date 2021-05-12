import type { MetaFunction, LinksFunction } from "remix";

import stylesUrl from "../styles/index.css";

export let meta: MetaFunction = () => {
   return {
      title: "Remix Ecom Experiment",
   };
};

export let links: LinksFunction = () => {
   return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
   return (
      <div style={{ textAlign: "center", padding: 20 }}>
         <h2>Welcome to the landing page!</h2>
         <p>Hope you have a nice landing :)</p>
      </div>
   );
}
