import { InvoiceFormData } from "@/components/EditForm";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReactNode } from "react";

export function extractTextFromReactNode(
  node: ReactNode,
): string {
  function recurse(n: ReactNode): string {
    if (typeof n === "string" || typeof n === "number") {
      return String(n);
    }

    if (Array.isArray(n)) {
      return n.map(recurse).join(" ");
    }

    if (n && typeof n === "object" && "props" in n) {
      return recurse((n as any).props.children);
    }

    return "";
  }

  // extract + clean spaces
  return recurse(node).replace(/\s+/g, " ").trim();
}

/* 
export const calculateTotal = (
  items: InvoiceFormData["items"],
): number => {
  return items.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );
};
 */

export const handleRowClick = (
  row: Record<string, React.ReactNode>,
  invoices: InvoiceFormData[] | undefined,
  setSelectedInvoice: (
    user: InvoiceFormData | null,
  ) => void,
  push: (
    href: string,
    options?: NavigateOptions | undefined,
  ) => void,
) => {
  if (!invoices) return null;

  // get id of clicked invoice
  const invoiceId = extractTextFromReactNode(
    row["invoiceId"],
  );

  // find the invoice in the list
  const findInvoice = invoices.find(
    (inv) => inv.invoiceId === invoiceId,
  );

  // update the selected invoice
  if (findInvoice) {
    setSelectedInvoice(findInvoice);
  }

  // go to invoice creator
  push("/charge-creator");
};

export function sortByNewest(
  invoices: InvoiceFormData[],
): InvoiceFormData[] {
  return [...invoices].sort((a, b) => {
    const idA = a.charge_id;
    const idB = b.charge_id;
    return idB - idA;
  });
}
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
};
