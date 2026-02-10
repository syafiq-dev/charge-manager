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
    </div>
  );
}

export default AllInvoicesPage;
