"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, {
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
} from "react";
import { IoClose } from "react-icons/io5";
import { MdError } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  SubmitHandler,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CircleCheck,
  CircleX,
  FileText,
} from "lucide-react";
import { IoMdCloseCircle } from "react-icons/io";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NumericFormat } from "react-number-format";
import { useRouter } from "next/navigation";

export interface InvoicePageRef {
  resetForm: () => void;
}

// Zod schema - Updated to match mock data
const invoiceSchema = z
  .object({
    charge_id: z.string().min(1, "Charge ID is required"),
    charge_amount: z
      .number()
      .min(0.01, "Amount must be greater than 0"),
    paid_amount: z
      .number()
      .min(0, "Paid amount cannot be negative"),
    student_id: z.string().min(1, "Student ID is required"),
    date_charged: z.date({}),
    status: z.enum(["paid", "unpaid", "partial"]),
  })
  .refine(
    (data) => data.paid_amount <= data.charge_amount,
    {
      message: "Paid amount cannot exceed charge amount",
      path: ["paid_amount"],
    },
  );

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

type ButtonProps = {
  text?: string;
  icon?: ReactNode;
  attributes?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick"
  >;
};

function generateRandomId(): string {
  const min = 10000;
  const max = 99999;
  const randomNumber =
    Math.floor(Math.random() * (max - min + 1)) + min;
  return `chg_${randomNumber}`;
}

function InvoicePageWithoutRef({
  onSubmit,
  selectedInvoice,
  onDelete,
  onClose,
  saveButton,
  deleteButton,
  ref,
}: {
  onSubmit?: SubmitHandler<InvoiceFormData>;
  saveButton?: ButtonProps;
  deleteButton?: ButtonProps;
  selectedInvoice?: InvoiceFormData | null;
  onDelete?: (invoice: InvoiceFormData) => void;
  onClose?: () => void;
  ref?: React.Ref<InvoicePageRef>;
}) {
  const router = useRouter();

  const methods = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      charge_id: generateRandomId(),
      charge_amount: 0,
      paid_amount: 0,
      student_id: "",
      date_charged: new Date(),
      status: "unpaid",
    },
  });

  const currentInvoice = methods.watch();

  const handleFormSubmit = (data: InvoiceFormData) => {
    // Convert date to string format matching mock data
    const formattedData = {
      ...data,
      date_charged: format(data.date_charged, "yyyy-MM-dd"),
    };
    onSubmit?.(formattedData as InvoiceFormData);
  };

  const resetFormWithNewId = () => {
    methods.reset({
      charge_id: generateRandomId(),
      charge_amount: 0,
      paid_amount: 0,
      student_id: "",
      date_charged: new Date(),
      status: "partial",
    });
  };

  useImperativeHandle(ref, () => ({
    resetForm: resetFormWithNewId,
  }));

  useEffect(() => {
    if (selectedInvoice) {
      // Convert string date back to Date object for form
      const formData = {
        ...selectedInvoice,
        date_charged: selectedInvoice.date_charged
          ? new Date(selectedInvoice.date_charged)
          : new Date(),
      };
      methods.reset(formData);
    } else {
      methods.reset({
        charge_id: generateRandomId(),
        charge_amount: 0,
        paid_amount: 0,
        student_id: "",
        date_charged: new Date(),
        status: "unpaid",
      });
    }
  }, [selectedInvoice, methods]);

  const defaultOnClose =
    onClose ??
    (() => {
      router.push("/all-invoices");
    });

  const saveButtonDefault: ButtonProps = {
    text: "Save",
    icon: <FaSave />,
  };
  const deleteButtonDefault: ButtonProps = {
    text: "Delete",
    icon: <IoMdCloseCircle />,
  };
  const mergedSaveButton: ButtonProps = {
    ...saveButtonDefault,
    ...saveButton,
  };
  const mergedDeleteButton: ButtonProps = {
    ...deleteButtonDefault,
    ...deleteButton,
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form
          className="poppins max-xl:grid-cols-1 grid grid-cols-2 max-sm:flex max-sm:flex-col"
          onSubmit={methods.handleSubmit(handleFormSubmit)}
        >
          <LeftArea onClose={defaultOnClose} />
          <RightArea
            saveButton={mergedSaveButton}
            deleteButton={mergedDeleteButton}
            onDelete={() =>
              onDelete && onDelete(currentInvoice)
            }
          />
        </form>
      </FormProvider>
    </div>
  );
}

const InvoicePage = forwardRef<
  InvoicePageRef,
  {
    onSubmit?: SubmitHandler<InvoiceFormData>;
    selectedInvoice?: InvoiceFormData | null;
    onDelete?: (invoice: InvoiceFormData) => void;
    onClose?: () => void;
    onResetFields?: () => void;
    saveButton?: ButtonProps;
    deleteButton?: ButtonProps;
  }
>((props, ref) => (
  <InvoicePageWithoutRef {...props} ref={ref} />
));

InvoicePage.displayName = "InvoicePage";

export default InvoicePage;

// LEFT AREA COMPONENT
function LeftArea({ onClose }: { onClose: () => void }) {
  const { control, watch } =
    useFormContext<InvoiceFormData>();

  const charge_id = watch("charge_id");
  const status = watch("status");

  const theHeader = (
    <div className="flex justify-between items-center">
      <div className="text-3xl gap-4 flex items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold">Charge</span>
          <span className="text-primary">{charge_id}</span>
        </div>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                className={` ${
                  field.value === "paid"
                    ? "bg-green-50"
                    : field.value === "unpaid"
                      ? "bg-red-50"
                      : "bg-gray-50"
                } border-none text-[15px] shadow-none w-[150px] pl-4 h-10 rounded-lg`}
              >
                <SelectValue placeholder="Select status">
                  {field.value === "paid" && "Paid"}
                  {field.value === "unpaid" && "Unpaid"}
                  {field.value === "partial" && "Partial"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="paid"
                  className="text-[15px]"
                >
                  <div className="text-[15px] text-green-600 h-8 items-center flex gap-2">
                    <CircleCheck size={18} />
                    <span>Paid</span>
                  </div>
                </SelectItem>
                <SelectItem value="unpaid">
                  <div className="text-[15px] h-8 text-red-600 items-center flex gap-2">
                    <CircleX size={18} />
                    <span>Unpaid</span>
                  </div>
                </SelectItem>
                <SelectItem value="partial">
                  <div className="text-[15px] h-8 text-gray-600 items-center flex gap-2">
                    <FileText size={18} />
                    <span>Partial</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div
        onClick={onClose}
        className="text-2xl text-slate-500 cursor-pointer"
      >
        <IoClose />
      </div>
    </div>
  );

  const billToSection = (
    <div className="mt-16">
      <span className="text-lg font-semibold">
        Charge Details
      </span>
      <StudentIdInput />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <ChargeAmountInput />
        <PaidAmountInput />
      </div>
      <div className="mt-4">
        <InvoiceDate />
      </div>
    </div>
  );

  return (
    <div className="p-10">
      {theHeader}
      {billToSection}
    </div>
  );
}

// Student ID Input Component
function StudentIdInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();

  return (
    <div className="mt-5 flex flex-col gap-2">
      <Label htmlFor="student-id" className="opacity-50">
        Student ID
      </Label>
      <Input
        type="text"
        id="student-id"
        className="h-11 shadow-none"
        placeholder="stu_101"
        {...register("student_id")}
      />
      {errors.student_id && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <MdError />
          <p>{errors.student_id.message}</p>
        </div>
      )}
    </div>
  );
}

// Charge Amount Input Component
function ChargeAmountInput() {
  const { control, watch } =
    useFormContext<InvoiceFormData>();
  const paidAmount = watch("paid_amount");
  const chargeAmount = watch("charge_amount");

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="charge-amount" className="opacity-50">
        Charge Amount (RM)
      </Label>
      <Controller
        name="charge_amount"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <FormattedNumberInput
              placeholder="0.00"
              value={field.value}
              onChange={field.onChange}
              className="h-11"
              prefix="RM "
              decimalScale={2}
            />
            {error && (
              <div className="text-red-500 flex gap-1 items-center text-[13px]">
                <MdError />
                <p>{error.message}</p>
              </div>
            )}
            {paidAmount > chargeAmount && (
              <div className="text-orange-500 flex gap-1 items-center text-[13px]">
                <MdError />
                <p>Paid amount exceeds charge amount</p>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}

// Paid Amount Input Component
function PaidAmountInput() {
  const { control, watch } =
    useFormContext<InvoiceFormData>();
  const chargeAmount = watch("charge_amount");

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="paid-amount" className="opacity-50">
        Paid Amount (RM)
      </Label>
      <Controller
        name="paid_amount"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <FormattedNumberInput
              placeholder="0.00"
              value={field.value}
              onChange={field.onChange}
              className="h-11"
              prefix="RM "
              decimalScale={2}
            />
            {error && (
              <div className="text-red-500 flex gap-1 items-center text-[13px]">
                <MdError />
                <p>{error.message}</p>
              </div>
            )}
          </>
        )}
      />
    </div>
  );
}

// Formatted Number Input Component
function FormattedNumberInput({
  placeholder,
  value,
  onChange,
  className,
  prefix = "",
  decimalScale = 2,
}: {
  placeholder?: string;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  prefix?: string;
  decimalScale?: number;
}) {
  return (
    <NumericFormat
      customInput={Input}
      placeholder={placeholder}
      value={value || ""}
      onValueChange={(values) => {
        const { floatValue } = values;
        onChange(floatValue || 0);
      }}
      thousandSeparator=","
      decimalScale={decimalScale}
      fixedDecimalScale={false}
      allowNegative={false}
      prefix={prefix}
      className={className}
    />
  );
}

function InvoiceDate() {
  const {
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="date-charged"
          className="opacity-50"
        >
          Date Charged
        </Label>
        <Controller
          control={control}
          name="date_charged"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!field.value}
                  className="data-[empty=true]:text-muted-foreground h-11 w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        />
        {errors.date_charged && (
          <div className="text-red-500 flex gap-1 items-center text-[13px]">
            <MdError />
            <p>{errors.date_charged.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// RIGHT AREA COMPONENT
function RightArea({
  onDelete,
  saveButton,
  deleteButton,
}: {
  onDelete: () => void;
  saveButton: ButtonProps;
  deleteButton: ButtonProps;
}) {
  const rightAreaHeader = (
    <div className="flex gap-4 items-center justify-end p-3">
      <Button
        type="button"
        onClick={onDelete}
        className="h-10 rounded-3xl pr-5 text-white bg-red-600 hover:bg-red-700"
        {...deleteButton.attributes}
      >
        {deleteButton.icon}
        {deleteButton.text}
      </Button>
      <Button
        type="submit"
        className="h-10 rounded-3xl px-8 bg-blue-600 hover:bg-blue-700"
        {...saveButton.attributes}
      >
        {saveButton.icon}
        {saveButton.text}
      </Button>
    </div>
  );

  return (
    <div className="p-10 bg-neutral-100 dark:bg-neutral-800">
      {rightAreaHeader}
      <SummarySection />
    </div>
  );
}

// Summary Section Component
function SummarySection() {
  const { watch } = useFormContext<InvoiceFormData>();

  const chargeAmount = watch("charge_amount") || 0;
  const paidAmount = watch("paid_amount") || 0;
  const balance = chargeAmount - paidAmount;
  const status = watch("status");

  return (
    <div className="mt-20">
      <span className="text-lg font-semibold">Summary</span>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span className="font-medium">
            Charge Amount:
          </span>
          <span className="font-bold">
            RM {chargeAmount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium">Paid Amount:</span>
          <span className="font-bold text-green-600">
            RM {paidAmount.toFixed(2)}
          </span>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="font-medium">Balance:</span>
            <span
              className={`font-bold ${
                balance === 0
                  ? "text-green-600"
                  : balance > 0
                    ? "text-orange-600"
                    : "text-red-600"
              }`}
            >
              RM {balance.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === "paid"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : status === "unpaid"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {status === "paid"
                ? "Paid"
                : status === "unpaid"
                  ? "Unpaid"
                  : "Partial"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import CalendarIcon if not already imported
import { Calendar as CalendarIcon } from "lucide-react";
