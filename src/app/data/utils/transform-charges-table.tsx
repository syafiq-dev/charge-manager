import { ReactNode } from "react";
import { format } from "date-fns";

import { InvoiceFormData } from "@/components/EditForm";
import { formatCurrency } from "@/app/utils";
import { renderChargeStatus } from "./render-charge-status";

export type extendKeysOnTable = InvoiceFormData & {
  charge_id: string;
  charge_amount: number;
  paid_amount: number;
  student_id: string;
  date_charged: string;
  status: string;
};

export const formatInvoicesForDisplay = (
  originalCharges: InvoiceFormData[],
): Record<keyof extendKeysOnTable, ReactNode>[] => {
  return originalCharges.map((charge) => ({
    ...charge,
    charge_id: (
      <span className="font-semibold text-primary">
        {charge.charge_id}
      </span>
    ),
    charge_amount: (
      <span className="font-bold text-primary">
        {formatCurrency(charge.charge_amount)}
      </span>
    ),
    paid_amount: (
      <span className="font-bold text-primary">
        {formatCurrency(charge.paid_amount)}
      </span>
    ),
    student_id: (
      <span className="font-semibold text-primary">
        {charge.student_id}
      </span>
    ),
    date_charged: (
      <span className="font-semibold text-primary">
        {charge.date_charged}
      </span>
    ),
    status: renderChargeStatus(charge.status),
  }));
};
