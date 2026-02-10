"use client";

import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { mockCharges } from "@/app/data/mock-charges";
import { InvoiceFormData } from "@/components/EditForm";
import { formatInvoicesForDisplay } from "@/app/data/utils/transform-charges-table";
import { Button } from "@/components/ui/button";
import { MdDelete, MdEdit } from "react-icons/md";
import { extractTextFromReactNode } from "@/app/utils";
import { toast } from "sonner";
import { tableHeaders } from "@/app/data/mock-charges";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useCharges } from "@/hooks/useCharges";

export default function ChargesTableWithState() {
  // State to manage charges
  const { charges, deleteCharge } = useCharges();
  const { resetToMockData } = useCharges();

  const [search, setSearch] = useState("");
  const { push } = useRouter();

  function goBackToDashboard() {
    push("/");
  }

  function goBackToChargeCreator() {
    push("/charge-creator");
  }

  // Format charges for display
  const tableData = formatInvoicesForDisplay(charges);

  // Delete function
  const handleDelete = (row: any) => {
    const chargeId = extractTextFromReactNode(
      row["charge_id"],
    );

    if (confirm(`Delete charge ${chargeId}?`)) {
      // Remove from state
      deleteCharge(chargeId);
    }
  };

  // Dropdown configuration
  const dropDownItems = {
    trigger: (
      <Button variant={"ghost"} className="text-lg">
        ...
      </Button>
    ),
    items: [
      {
        label: "Edit",
        icon: <MdEdit />,
        onClick: (row: any) => {
          const chargeId = extractTextFromReactNode(
            row["charge_id"],
          );
          console.log("Edit:", chargeId);

          push("/edit-charge/" + chargeId);
          // Add edit logic here
        },
      },
      {
        label: "Delete",
        className: "text-red-600",
        icon: <MdDelete />,
        separator: true,
        onClick: handleDelete, // This now updates state
      },
    ],
  };

  return (
    <DataTable
      title="Charge Manager"
      showSortingButtons={false}
      className="p-7 border-none shadow-none"
      description={`${mockCharges.length} charges`}
      clickableColumns={["student_id"]}
      pagination={{ rowsPerPage: 10 }}
      showCheckboxes={{ enable: true }}
      filterBy={["student_id"]}
      headers={tableHeaders}
      rows={tableData}
      notFoundText="Charge not found..."
      dropDownItems={dropDownItems}
      search={{
        keyToSearchBy: "student_id",
        searchValue: search,
        setSearchValue: setSearch,
        placeholder: "Search for Student ID",
      }}
      enableStripedRows={true}
      showActionsColumn={true}
      callToAction={
        <div className="flex items-center gap-2">
          <Button
            onClick={goBackToDashboard}
            variant={"outline"}
            className="h-10"
          >
            <IoIosArrowRoundBack />
            <span>Back</span>
          </Button>
          <Button
            onClick={goBackToChargeCreator}
            className="h-10"
          >
            <FaPlus />
            <span>New Charge</span>
          </Button>
          <Button
            onClick={() => {
              if (
                confirm("Reset all charges to sample data?")
              ) {
                resetToMockData();
                toast.warning("Reset to sample data", {
                  position: "bottom-right",
                  className: "!bg-yellow-400 !text-black",
                });
              }
            }}
            variant={"outline"}
            className="text-gray-500"
          >
            Reset Data
          </Button>
        </div>
      }
    ></DataTable>
  );
}
