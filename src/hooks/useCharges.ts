"use client";

import { useState, useEffect } from "react";
import { InvoiceFormData } from "@/components/EditForm";
import { mockCharges } from "@/app/data/mock-charges";
import { toast } from "sonner";

// load from LocalStorage or use mock data
const loadCharges = (): InvoiceFormData[] => {
  if (typeof window === "undefined") return mockCharges;

  const saved = localStorage.getItem("charges-data");

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return mockCharges;
    }
  }
  return mockCharges;
};

// Save to LocalStorage
const saveCharges = (charges: InvoiceFormData[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "charges-data",
      JSON.stringify(charges),
    );
  }
};

// SINGLETON with LocalStorage
let globalCharges = loadCharges();
let listeners: Array<() => void> = [];

function notifyAll() {
  listeners.forEach((listener) => listener());
  saveCharges(globalCharges); // save to localstorage
}

export function useCharges() {
  const [charges, setCharges] =
    useState<InvoiceFormData[]>(globalCharges);

  useEffect(() => {
    const updateLocal = () =>
      setCharges([...globalCharges]);
    listeners.push(updateLocal);

    return () => {
      const index = listeners.indexOf(updateLocal);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  // CREATE: Add new charge
  const addCharge = (newCharge: InvoiceFormData) => {
    globalCharges = [...globalCharges, newCharge];
    notifyAll();

    //save state/API
    var apiStr = `{'url': 'api_url', 'action': 'create', 'charge_id':'${newCharge.charge_id}'}`;
    console.log("API\n", apiStr);

    toast.success("Charge Creation", {
      description: "Successfully created Charge",
      position: "bottom-right",
      className: "!bg-blue-400 !text-white",
      classNames: {
        description: " !text-neutral-100",
      },
    });
  };

  // READ: Get charge by ID
  const getCharge = (chargeId: string) => {
    return globalCharges.find(
      (charge) => charge.charge_id === chargeId,
    );
  };

  // UPDATE: Edit existing charge
  const updateCharge = (
    chargeId: string,
    updatedData: Partial<InvoiceFormData>,
  ) => {
    globalCharges = globalCharges.map((charge) =>
      charge.charge_id === chargeId
        ? { ...charge, ...updatedData }
        : charge,
    );
    notifyAll();

    var apiStr = `{'url': 'api_url', 'action': 'update', 'charge_id':'${chargeId}'}`;
    console.log("API\n", apiStr);

    toast.success("Updated charge: " + chargeId, {
      position: "bottom-right",
      className: "!bg-blue-400 !text-white",
      classNames: {
        description: " !text-neutral-100",
      },
    });
  };

  // DELETE: Remove charge
  const deleteCharge = (chargeId: string) => {
    globalCharges = globalCharges.filter(
      (charge) => charge.charge_id !== chargeId,
    );
    notifyAll();

    var apiStr = `{'url': 'api_url', 'action': 'delete', 'charge_id':'${chargeId}'}`;
    console.log("API\n", apiStr);

    toast.success(
      `Charge ${chargeId} deleted successfully`,
      {
        position: "bottom-right",
        className: "!bg-blue-400 !text-white",
        classNames: {
          description: " !text-neutral-100",
        },
      },
    );
  };

  // Reset to mock data
  const resetToMockData = () => {
    globalCharges = [...mockCharges];
    notifyAll();
  };

  return {
    charges,
    addCharge,
    getCharge,
    updateCharge,
    deleteCharge,
    resetToMockData,
  };
}
