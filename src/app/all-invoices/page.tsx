"use client";

import React, { useState } from "react";
import { useInvoiceDropDownOptions } from "./invoice-dropdown";
import { DataTable } from "@/components/DataTable";
import {
  mockCharges,
  tableHeaders,
} from "../data/mock-charges";
import { formatInvoicesForDisplay } from "../data/utils/transform-charges-table";
import { Button } from "@/components/ui/button";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import ChargesTableWithState from "@/components/ChargeTableWithState";

function AllInvoicesPage() {
  const [search, setSearch] = useState("");
  const { push } = useRouter();
  const dropDownItems = useInvoiceDropDownOptions();

  function goBackToDashboard() {
    push("/");
  }

  function goBackToChargeCreator() {
    push("/charge-creator");
  }

  return (
    <div>
      <ChargesTableWithState />
      {/* 
      <DataTable
        title="All Charges"
        showSortingButtons={false}
        className="p-7 border-none shadow-none"
        description={`${mockCharges.length} charges`}
        clickableColumns={["student_id"]}
        pagination={{ rowsPerPage: 10 }}
        showCheckboxes={{ enable: true }}
        filterBy={["student_id"]}
        headers={tableHeaders}
        rows={formatInvoicesForDisplay(mockCharges)}
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
          </div>
        }
      ></DataTable> */}
    </div>
  );
}

export default AllInvoicesPage;
