import { useEffect, useState } from "react";

// global hydrating so future components don't do this dance, they just render
let hydrating = true;

function useIsClient() {
  // set initial state to whatever the global hydrating is, so once the app is
  // hydrated, these components just render, no dance
  let [hydrated, setHydrated] = useState(() => !hydrating);

  // after hydration, rerender
  useEffect(() => {
    hydrating = false;
    setHydrated(true);
  }, []);

  return hydrated;
}

// Component that renders `null` on the server and the initial browser render
// (while it's "hydrating")
export function ClientOnly({ children }: { children: any }) {
  const hydrated = useIsClient();

  // only render if hydrated
  return hydrated ? children : null;
}
