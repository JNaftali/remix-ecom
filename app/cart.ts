import { createCookie, createCookieSessionStorage, json } from "remix";
import { Response } from "node-fetch";
import type { Request } from "node-fetch";

const { getSession, commitSession, destroySession } =
   createCookieSessionStorage({
      cookie: createCookie("__cart", {
         path: "/",
         sameSite: "strict",
         httpOnly: true,
         secure: true,
         secrets: ["sad908ajd"],
      }),
   });

export { destroySession };

export async function withCart<Loader extends (cart: Cart) => Promise<any>>(
   req: Request,
   loader: Loader,
): Promise<ReturnType<Loader>> {
   const session = await getSession(req.headers.get("Cookie"));

   /**
    * This type is innacurate but it forces us to handle the 2 cases:
    * 1. loader returns a Response
    * 2. loader returns something else
    * so I don't care if it's right
    */
   let result: Response | string = await loader({
      get lines() {
         return session.get("lines") ?? [];
      },
      set lines(newLines: LineItem[]) {
         session.set("lines", newLines ?? []);
      },
   });

   if (!(result instanceof Response)) {
      result = json(result);
   }
   result.headers.set("Set-Cookie", await commitSession(session));
   return result;
}

export interface Cart {
   lines: LineItem[];
}

export interface LineItem {
   sku: string;
   quantity: number;
}
