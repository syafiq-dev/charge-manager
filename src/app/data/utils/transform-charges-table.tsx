import { ReactNode } from "react";
import { format } from "date-fns";

import { InvoiceFormData } from "@/components/EditForm";
import { formatCurrency } from "@/app/utils";

export type extendKeysOnTable = InvoiceFormData & {
  charge_id: string;
  charge_amount: number;
  paid_amount: number;
  student_id: string;
  date_charged: string;
  status: string;
};

export const formatInvoicesForDisplay = (
  originalInvoices: InvoiceFormData[],
): Record<keyof extendKeysOnTable, ReactNode>[] => {
  return originalInvoices.map((invoice) => ({
    ...invoice,
    charge_id: (
      <span className="font-semibold text-primary">
        {invoice.charge_id}
      </span>
    ),
    charge_amount: (
      <span className="font-bold text-primary">
        {formatCurrency(invoice.charge_amount)}
      </span>
    ),
    paid_amount: (
      <span className="font-bold text-primary">
        {formatCurrency(invoice.paid_amount)}
      </span>
    ),
    student_id: (
      <span className="font-semibold text-primary">
        {invoice.student_id}
      </span>
    ),
    date_charged: (
      <span className="font-semibold text-primary">
        {invoice.date_charged}
      </span>
    ),
  }));
};
