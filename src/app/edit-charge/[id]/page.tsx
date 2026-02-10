"use client";

import { mockCharges } from "@/app/data/mock-charges";
import InvoicePage, {
  InvoiceFormData,
} from "@/components/EditForm";
import { useCharges } from "@/hooks/useCharges";
import { useParams, useRouter } from "next/navigation";

const EditChargePage = () => {
  const params = useParams();
  const router = useRouter();
  const { getCharge, updateCharge, deleteCharge } =
    useCharges();

  const chargeId = params.id as string;
  const charge = getCharge(chargeId);

  const handleSubmit = (data: InvoiceFormData) => {
    updateCharge(chargeId, data);

    router.push("/all-invoices");
  };

  const handleDelete = (data: InvoiceFormData) => {
    if (confirm(`Delete charge ${data.charge_id}?`)) {
      deleteCharge(chargeId);

      router.push("/all-invoices");
    }
  };

  if (!charge) {
    return (
      <div className="p-6">
        <h1 className="text-xl text-red-600">
          Charge {chargeId} not found
        </h1>
        <button
          onClick={() => router.push("/all-invoices")}
          className="mt-4 px-4 py-2 bg-blue-400 text-white rounded"
        >
          Back to Charge Manager
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Edit Charge:
        <span className="text-blue-400">{chargeId}</span>
      </h1>

      <InvoicePage
        selectedInvoice={charge}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onClose={() => router.back()}
      />
    </div>
  );
};

export default EditChargePage;
