"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const InvoicePaymentsHeader = () => {
  const exportOnClick = () => {
    toast.info("Coming Soon", {
      description: "Work In Progress...",
      position: "bottom-right",
      className: "!bg-blue-400 !text-white",
      classNames: {
        description: " !text-neutral-100",
      },
    });
  };

  return (
    <div className="flex items-center justify-between w-full mb-6 pt-7">
      <h2 className="text-lg font-semibold">
        View All Charges
      </h2>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={exportOnClick}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default InvoicePaymentsHeader;
