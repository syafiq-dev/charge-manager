import { InvoiceFormData } from "@/components/EditForm";
import { extendKeysOnTable } from "./utils/transform-charges-table";

export const tableHeaders: Record<
  keyof extendKeysOnTable,
  string
> = {
  charge_id: "Charge ID",
  charge_amount: "Charge Amount (RM)",
  paid_amount: "Paid Amount (RM)",
  student_id: "Student ID",
  date_charged: "Date Charged",
  status: "Status",
};

export const mockCharges: InvoiceFormData[] = [
  {
    charge_id: "chg_001",
    charge_amount: 120.0,
    paid_amount: 0.0,
    student_id: "stu_101",
    date_charged: "2025-01-05",
    status: "unpaid",
  },
  {
    charge_id: "chg_002",
    charge_amount: 80.5,
    paid_amount: 80.5,
    student_id: "stu_102",
    date_charged: "2025-01-07",
    status: "paid",
  },
  {
    charge_id: "chg_003",
    charge_amount: 150.0,
    paid_amount: 50.0,
    student_id: "stu_101",
    date_charged: "2025-01-12",
    status: "partial",
  },
  {
    charge_id: "chg_004",
    charge_amount: 95.0,
    paid_amount: 0.0,
    student_id: "stu_103",
    date_charged: "2025-01-15",
    status: "unpaid",
  },
  {
    charge_id: "chg_005",
    charge_amount: 200.0,
    paid_amount: 200.0,
    student_id: "stu_104",
    date_charged: "2025-01-20",
    status: "paid",
  },
];
