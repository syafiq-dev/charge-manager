import React from "react";
import InvoicePaymentsHeader from "./table-header-overview";
import { Card } from "@/components/ui/card";
import InvoiceTabs from "./InvoiceTabs";

const TableSection = () => {
  return (
    <div className="px-10">
      <InvoicePaymentsHeader />
      <Card>
        <InvoiceTabs />
      </Card>
    </div>
  );
};

export default TableSection;
