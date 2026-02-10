import { InvoiceFormData } from "@/components/EditForm";
import { Badge } from "@/components/ui/badge";

export const statusColors: Record<
  InvoiceFormData["status"],
  {
    textColor: string;
    bgColor: string;
    hoverBgColor: string;
  }
> = {
  paid: {
    textColor: "text-green-600",
    bgColor: "bg-green-100",
    hoverBgColor: "hover:bg-green-100",
  },
  unpaid: {
    textColor: "text-red-600",
    bgColor: "bg-red-100",
    hoverBgColor: "hover:bg-red-100",
  },
  partial: {
    textColor: "text-amber-600",
    bgColor: "bg-amber-100",
    hoverBgColor: "hover:bg-amber-100",
  },
};

export function renderChargeStatus(
  status: InvoiceFormData["status"],
) {
  const colors = statusColors[status];

  if (!colors) {
    return (
      <Badge className="bg-gray-500 select-none rounded-full px3 shadow-none">
        unknown
      </Badge>
    );
  }

  return (
    <Badge
      className={`select-none rounded-full px-3 shadow-none ${colors.textColor} ${colors.bgColor} ${colors.hoverBgColor}`}
    >
      {status.toUpperCase()}
    </Badge>
  );
}
