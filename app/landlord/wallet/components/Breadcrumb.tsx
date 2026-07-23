import React, { Fragment } from "react";
import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string; // omit href on the current/last page
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <p className="text-xs text-slate-400 mb-1">
      {items.map((item, i) => (
        <Fragment key={item.label}>
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-slate-600 hover:underline cursor-pointer"
            >
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          {i < items.length - 1 && " / "}
        </Fragment>
      ))}
    </p>
  );
}
