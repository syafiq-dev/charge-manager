import { DropdownMenu } from "@/components/DataTable";
import { formatInvoicesForDisplay } from "../data/utils/transform-charges-table";
import { Button } from "@/components/ui/button";
import { extractTextFromReactNode } from "../utils";
import { MdDelete, MdEdit } from "react-icons/md";
import { useCharges } from "@/hooks/useCharges";
import { toast } from "sonner";

export function useInvoiceDropDownOptions() {
  // use charges hook
  const { charges, deleteCharge } = useCharges();

  const invoiceDropDownOptions: DropdownMenu<
    ReturnType<typeof formatInvoicesForDisplay>[number]
  > = {
    trigger: (
      <Button variant={"ghost"} className="text-lg">
        ...
      </Button>
    ),
    items: [
      {
        label: "Edit",
        icon: <MdEdit />,
        onClick: (row) => {
          const chargeId = extractTextFromReactNode(
            row["charge_id"],
          );
          console.log("EDIT:", chargeId);
        },
      },
      {
        label: "Delete",
        className: "text-red-600",
        icon: <MdDelete />,
        separator: true,
        onClick: (row) => {
          const chargeId = extractTextFromReactNode(
            row["charge_id"],
          );

          // Confirmation dialog
          if (
            confirm(
              `Are you sure you want to delete charge ${chargeId}`,
            )
          ) {
            // Call delete function
            deleteCharge(chargeId);

            toast.success("Delete Success", {
              description:
                "Successfully deleted charge ID: " +
                chargeId,
            });
          }
          console.log("EDIT:", chargeId);
        },
      },
    ],
  };

  return invoiceDropDownOptions;
}
