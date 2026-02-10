"use client";

import InvoicePage, {
  InvoiceFormData,
} from "@/components/EditForm";
import { useCharges } from "@/hooks/useCharges";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CreateChargePage = () => {
  const router = useRouter();
  const { addCharge } = useCharges();

  const handleSubmit = (data: InvoiceFormData) => {
    addCharge(data);

    router.push("/all-invoices");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Create New Charge
      </h1>
      <InvoicePage
        onSubmit={handleSubmit}
        onClose={() => router.back()}
      />
    </div>
  );
};

export default CreateChargePage;
