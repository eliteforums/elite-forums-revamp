import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

/**
 * A link whose address comes from the admin console: site paths ("/events",
 * "/apply?program=cohort") navigate within the app, anything else ("https://…",
 * "mailto:…") is a normal link, opened in a new tab when it leaves the site.
 */
export function SmartLink({
  href,
  children,
  className,
  activeClassName,
  exact,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}) {
  const target = href.trim() || "/";
  if (target.startsWith("/") && !target.startsWith("//")) {
    const [path, query] = target.split("?");
    const search = query ? Object.fromEntries(new URLSearchParams(query)) : undefined;
    const props = {
      to: path as never,
      ...(search ? { search: search as never } : {}),
      ...(className ? { className } : {}),
      ...(activeClassName ? { activeProps: { className: activeClassName } } : {}),
      activeOptions: { exact: exact ?? path === "/", includeSearch: false },
      ...(onClick ? { onClick } : {}),
    } as ComponentProps<typeof Link>;
    return <Link {...props}>{children}</Link>;
  }
  const external = /^https?:\/\//.test(target);
  return (
    <a
      href={target}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
