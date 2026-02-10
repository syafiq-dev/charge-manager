"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GoArrowRight } from "react-icons/go";
import {
  mockCharges,
  tableHeaders,
} from "@/app/data/mock-charges";
import { formatInvoicesForDisplay } from "../data/utils/transform-charges-table";
import { useCharges } from "@/hooks/useCharges";

const invoiceTabs = [
  {
    value: "all",
    label: "All Charges",
    invoices: mockCharges,
  },
  {
    value: "paid",
    label: "Paid",
    invoices: mockCharges.filter((c) => c.paid_amount > 0),
  },
  {
    value: "unpaid",
    label: "Unpaid",
    invoices: mockCharges.filter((c) => c.paid_amount == 0),
  },
];

export default function InvoiceTabs() {
  const { push } = useRouter();

  const { charges } = useCharges();

  const tableData = formatInvoicesForDisplay(charges);

  return (
    <div className="">
      <Tabs defaultValue="all" className="w-full p-3">
        {/* Tabs List */}
        <div className="flex justify-between">
          {/* <TabsList className="flex bg-transparent gap-4 rounded-lg border dark:bg-neutral-800 p-2 justify-start w-fit ">
            <>
              {invoiceTabs.map((tab) => {
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center text-sm gap-1 rounded-lg data-[state=active]:font-semibold data-[state=active]:text-primary"
                >
                  {tab.label}
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0 bg-transparent data-[state=active]:text-primary"
                  >
                    {tab.invoices.length}
                  </Badge>
                </TabsTrigger>;
              })}
            </>
          </TabsList>  */}
          <Button
            variant={"outline"}
            onClick={() => {
              push("/all-invoices");
            }}
          >
            <span>Manage Charges</span>
            <GoArrowRight />
          </Button>
        </div>

        {/* Tabs Content */}
        {invoiceTabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-0"
          >
            <div>
              <DataTable
                className="border-none shadow-none p-0 py-0"
                eliminateOuterPadding={true}
                headers={tableHeaders}
                rows={tableData}
                rowHeight={48}
                enableStripedRows={true}
                // columnsToHide={["paidDate", "items"]}
                // sort={{ defaultProperty: "student_id" }}
              />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
