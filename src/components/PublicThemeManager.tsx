import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Admin / staff portals keep the light CRM shell; public site uses dark navy tokens on `:root`. */
function isAdminShellPath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/staff/login")
  );
}

export default function PublicThemeManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (isAdminShellPath(pathname)) {
      root.classList.add("theme-admin");
    } else {
      root.classList.remove("theme-admin");
    }
    return () => {
      root.classList.remove("theme-admin");
    };
  }, [pathname]);

  return null;
}
