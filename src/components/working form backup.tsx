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
import { MdDelete, MdError } from "react-icons/md";
import { FaSave, FaTrash } from "react-icons/fa";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  useFieldArray,
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
  Calendar as CalendarIcon,
  CircleCheck,
  CirclePlus,
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

// Zod schema
const invoiceSchema = z
  .object({
    //syafiq.dev

    charge_id: z.string(),
    charge_amount: z
      .number()
      .min(1, "Amount must be at least 1"),
    paid_amount: z
      .number()
      .min(1, "Quantity must be at least 1"),
    student_id: z.string(),
    date_charged: z.string(),
    status: z.enum(["paid", "unpaid", "draft"]), // Changed "Draft" to lowercase "draft"

    //====================
  })
  // If status = paid → paidDate is required
  .refine(
    (data) =>
      !(data.status === "paid" && !data.date_charged),
    {
      message: "Paid date is required when status is paid",
      path: ["paidDate"],
    },
  );
// If status = paid → invoiceDate is required
/* .refine(
    (data) =>
      !(data.status === "paid" && !data.invoiceDate),
    {
      message:
        "Invoice date is required when status is paid",
      path: ["invoiceDate"],
    },
  ); */

export type InvoiceFormData = z.infer<typeof invoiceSchema>;

type ButtonProps = {
  text?: string;
  icon?: ReactNode;
  attributes?: Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "OnClick"
  >;
};

function generateRandomId(): string {
  // Generate a random 5-digit number
  const min = 10000; // Smallest 5-digit number
  const max = 99999; // Largest 5-digit number
  const randomNumber =
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Prepend '#' to the number to create the ID
  return `#${randomNumber}`;
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
  ref?: React.Ref<InvoicePageRef>; // Add ref type
}) {
  // Get today's date
  const today = new Date();

  const router = useRouter();

  // Create a new Date object for tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const methods = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      charge_id: "",
      charge_amount: 0,
      paid_amount: 0,
      student_id: "",
      date_charged: "",
      status: "draft", // Changed default to "draft"
    },
  });

  const currentInvoice = methods.watch();

  const handleFormSubmit = (data: InvoiceFormData) => {
    onSubmit?.(data);
  };

  // Add this reset function
  const resetFormWithNewId = () => {
    methods.reset({
      charge_id: generateRandomId(),
      charge_amount: 0,
      paid_amount: 0,
      student_id: "",
      date_charged: "",
      status: "draft", // Changed default
    });
  };

  // Expose the reset function through ref
  useImperativeHandle(ref, () => ({
    resetForm: resetFormWithNewId,
  }));

  // Use useEffect to reset the form when selectedInvoice changes
  useEffect(() => {
    if (selectedInvoice) {
      // The reset method updates the form values
      methods.reset(selectedInvoice);
      methods.trigger();
    } else {
      methods.setValue("charge_id", generateRandomId());
      methods.setValue("date_charged", "");
      methods.setValue("student_id", "");

      // methods.setValue("invoiceDate", new Date());
    }
  }, [selectedInvoice, methods]); // The dependency array ensures this runs when selectedInvoice or methods change

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

//
//
// LEFT AREA COMPONENT
//
function LeftArea({ onClose }: { onClose: () => void }) {
  const { control, watch } =
    useFormContext<InvoiceFormData>();

  const charge_id = watch("charge_id");

  //This is the header of the left area
  const theHeader = (
    <div className="flex justify-between items-center">
      <div className="text-3xl gap-4 flex items-center">
        <div className="flex items-center gap-2">
          <span className="font-bold">Charge</span>
          <span className="text-primary">{charge_id}</span>
        </div>
        <Controller
          key={charge_id}
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
                  {field.value === "draft" && "Draft"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="paid"
                  className="text-[15px]"
                >
                  <div className="text-[15px] text-green-600 h-8 items-center flex gap-2">
                    <span>
                      <CircleCheck size={18} />
                    </span>
                    <span>Paid</span>
                  </div>
                </SelectItem>
                <SelectItem value="unpaid">
                  <div className="text-[15px] h-8 text-red-600 items-center flex gap-2">
                    <span>
                      <CircleX size={18} />
                    </span>
                    <span>Unpaid</span>
                  </div>
                </SelectItem>
                <SelectItem value="draft">
                  <div className="text-[15px] h-8 text-gray-600 items-center flex gap-2">
                    <span>
                      <FileText size={18} />
                    </span>
                    <span>Draft</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div
        onClick={() => onClose()}
        className="text-2xl text-slate-500 cursor-pointer"
      >
        <IoClose />
      </div>
    </div>
  );
  // the bills to section
  const billToSection = (
    <div className="mt-16">
      <span className="text-lg font-semibold">Bill To</span>
      {/* <ClientInput /> */}
      {/* <StreetAddress /> */}
      {/* <CityAndCountry /> */}
      <div className="grid grid-cols-2 gap-4">
        <InvoiceDate />
        {/* DISABLED
        <InvoicePaidDate />
       */}
      </div>
      {/* DISABLED
      <div className="grid grid-cols-2 gap-4">
        <DueDate />
      </div>
     */}
    </div>
  );

  // the items list
  /* DISABLED
  const itemsList = (
    <div className="mt-14">
      <div className="flex justify-between">
        <span className="text-[18px] font-semibold">
          Product List
        </span>
        <span
          className="bg-neutral-200 dark:bg-neutral-600  dark:text-neutral-400 size-6 flex items-center justify-center
         text-sm p-1 rounded-full"
        >
          {listItems.length}
        </span>
      </div>
      <ItemListInputs />
    </div>
  );
 */
  return (
    <div className="p-10">
      <>{theHeader}</>
      <>{billToSection}</>
      {/* DISABLED 
      <>{itemsList}</> */}
    </div>
  );
}
//
//
// *****************************************
//
// All the components used in the left section
//
// *****************************************
//
//
//=> Client name input

/* DISABLED 
function ClientInput() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();

  return (
    <div className="mt-5 flex flex-col gap-2">
      <Label htmlFor="client-name" className="opacity-50">
        Client&apos;s Name
      </Label>
      <Input
        type="text"
        id="client-name"
        className="h-11 shadow-none"
        placeholder="Alex Groggy"
        {...register("clientName")}
      />
      {errors.clientName && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <MdError />
          <p>{errors.clientName.message}</p>
        </div>
      )}
    </div>
  );
}

//=> street address input
function StreetAddress() {
  const {
    register,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();

  return (
    <div className="mt-7 flex flex-col gap-2">
      <Label
        htmlFor="street-address"
        className="opacity-50"
      >
        Street Address
      </Label>
      <Input
        className="h-11"
        type="text"
        id="street-address"
        placeholder="street address"
        {...register("streetAddress")}
      />
      {errors.streetAddress && (
        <div className="text-red-500 flex gap-1 items-center text-[13px]">
          <MdError />
          <p>{errors.streetAddress.message}</p>
        </div>
      )}
    </div>
  );
}
 */

//=> items list component
function ItemListInputs() {
  const columnHeaders = [
    "Product Name",
    "Qty.",
    "Price",
    "Total",
    "",
  ];

  const {
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const addNewItem = () => {
    append({ name: "", quantity: 1, price: 0 });
  };

  return (
    <div>
      {/* The headers */}
      <div className="grid  grid-cols-[2fr_1fr_2fr_2fr_0.3fr] gap-3 mt-5 ">
        {columnHeaders.map((header, index) => (
          <span
            className="opacity-50 font-medium text-sm"
            key={index}
          >
            {header}
          </span>
        ))}
      </div>
      {/* the inputs */}
      {fields.map((field, index) => (
        <ItemRow
          key={field.id}
          index={index}
          onRemove={() => remove(index)}
          canRemove={fields.length > 1}
        />
      ))}

      {/* Error message for items array */}
      {errors.items && !Array.isArray(errors.items) && (
        <div className="text-red-500 flex gap-1 items-center text-[13px] mt-2">
          <MdError />
          <p>{errors.items.message}</p>
        </div>
      )}
      {/* the button add a new item */}
      <Button
        onClick={addNewItem}
        variant={"secondary"}
        className="mt-7 h-11 w-full rounded-3xl"
      >
        <CirclePlus />
        Add New Product
      </Button>
    </div>
  );
}

//=> Item Row used in the ItemListInputs fucntion
/* function ItemRow({
  index,
  onRemove,
  canRemove,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();

  // Watch quantity and price to calculate total
  const quantity = watch(`items.${index}.quantity`);
  const price = watch(`items.${index}.price`);
  const total = (quantity || 0) * (price || 0);

  const itemErrors = errors.items?.[index];

  return (
    <div>
      <div className="grid grid-cols-[2fr_1fr_2fr_2fr_0.3fr] gap-3 mt-3">
        <div>
          <Input
            type="text"
            className="h-11"
            placeholder={`Item ${index + 1}`}
            {...register(`items.${index}.name`)}
          />
          {itemErrors?.name && (
            <div className="text-red-500 flex gap-1 items-center text-[10px] mt-1">
              <MdError size={10} />
              <p>{itemErrors.name.message}</p>
            </div>
          )}
        </div>

        <div>
          <Controller
            name={`items.${index}.quantity`}
            control={control}
            render={({ field }) => (
              <FormattedNumberInput
                placeholder="1"
                value={field.value}
                onChange={field.onChange}
                className="h-11"
                decimalScale={0} // No decimals for quantity
              />
            )}
          />
          {itemErrors?.quantity && (
            <div className="text-red-500 flex gap-1 items-center text-[10px] mt-1">
              <MdError size={10} />
              <p>{itemErrors.quantity.message}</p>
            </div>
          )}
        </div>

        <div>
          <Controller
            name={`items.${index}.price`}
            control={control}
            render={({ field }) => (
              <FormattedNumberInput
                placeholder="0.00"
                value={field.value}
                onChange={field.onChange}
                className="h-11"
                prefix="$"
                decimalScale={2}
              />
            )}
          />
          {itemErrors?.price && (
            <div className="text-red-500 flex gap-1 items-center text-[10px] mt-1">
              <MdError size={10} />
              <p>{itemErrors.price.message}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <span className="text-sm font-semibold">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="flex justify-center items-center">
          {canRemove && (
            <MdDelete
              className="text-2xl text-red-500 cursor-pointer hover:text-red-600"
              onClick={onRemove}
            />
          )}
        </div>
      </div>
    </div>
  );
} */

////////////////////////////////////

// Custom formatted number input component
function FormattedNumberInput({
  placeholder,
  value,
  onChange,
  className,
  prefix = "",
  decimalScale = 2,
  ...props
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
      {...props}
    />
  );
}

function InvoiceDate() {
  const {
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();

  return (
    <div className="w-full mt-7">
      <div className="flex flex-col gap-2">
        <Label htmlFor="city" className="opacity-50">
          Charge Date
        </Label>
        <Controller
          control={control}
          //   defaultValue={new Date()}
          name="date_charged"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  data-empty={!field.value}
                  className="data-[empty=true]:text-muted-foreground h-11 w-full justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  disabled={(date) => date > new Date()}
                  mode="single"
                  selected={field.value}
                  onSelect={(selectedDate) => {
                    // Only update if a date is selected (prevents unselecting)
                    if (selectedDate) {
                      field.onChange(selectedDate);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />
      </div>
    </div>
  );
}

function InvoicePaidDate() {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<InvoiceFormData>();

  const status = watch("status");

  return (
    <div className="w-full mt-7">
      {/* city */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="city" className="opacity-50">
          Invoice Paid Date
        </Label>
        <Controller
          control={control}
          //   defaultValue={new Date()}
          disabled={
            status === "unpaid" || status === "draft"
          } // Fixed: changed "Draft" to "draft"
          name="paidDate"
          render={({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={
                    status === "unpaid" ||
                    status === "draft"
                  } // Also fixed here
                  data-empty={!field.value}
                  className="data-[empty=true]:text-muted-foreground h-11 w-full justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  disabled={(date) => date > new Date()}
                  mode="single"
                  selected={field.value}
                  onSelect={(selectedDate) => {
                    // Only update if a date is selected (prevents unselecting)
                    if (selectedDate) {
                      field.onChange(selectedDate);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          )}
        />

        {status === "paid" && (
          <>
            {errors.paidDate && (
              <div className="text-red-500 flex gap-1 items-center text-[13px]">
                <MdError />
                <p>{errors.paidDate.message}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

//
//
// RIGHT AREA COMPONENT
//
function RightArea({
  onDelete,
  saveButton,
  deleteButton,
}: {
  onDelete: () => void;
  saveButton: ButtonProps;
  deleteButton: ButtonProps;
}) {
  //
  const rightAreaHeader = (
    <div className="flex gap-4 items-center justify-end p-3  ">
      <Button
        type="button"
        onClick={onDelete} // Fixed: removed arrow function wrapper
        className="h-10 rounded-3xl  pr-5 text-white bg-red-600 hover:bg-red-600"
        {...deleteButton.attributes}
      >
        {deleteButton.icon}
        {deleteButton.text}
      </Button>
      <Button
        type="submit"
        className="h-10 rounded-3xl px-8"
        {...saveButton.attributes}
      >
        {saveButton.icon}
        {saveButton.text}
      </Button>
    </div>
  );
  return (
    <div
      className={`p-10 bg-neutral-100 dark:bg-neutral-800`}
    >
      <>{rightAreaHeader}</>
      <SentTo />
      {/* <LineItems /> */}
    </div>
  );
}
//
//
// *****************************************
//
// All the components used in the right left section
//
// *****************************************
//
//
//
function SentTo() {
  const { watch } = useFormContext<InvoiceFormData>();
  const fullName = watch("clientName");
  const address = watch("streetAddress");
  const city = watch("city");
  const country = watch("country");

  return (
    <div className="flex flex-col  mt-20">
      <span className="text-lg font-semibold text-opacity-45">
        Bill to
      </span>

      {/* client Name */}
      <div className="flex items-center gap-2 mt-3">
        <p className="font-medium text-sm">Name: </p>
        <p className="text-sm p-[2px]">{fullName}</p>
      </div>
      {/* Address */}
      <div className="flex items-center gap-2 mt-[1px] ">
        <p className="font-medium text-sm">Address: </p>
        <p className="text-sm p-[2px]">{address}</p>
      </div>
      {/* City */}
      <div className="flex items-center gap-2  mt-[1px] ">
        <p className="font-medium text-sm">City: </p>
        <p className="text-sm p-[2px]">{city}</p>
      </div>
      {/* Country */}
      <div className="flex items-center gap-2  mt-[1px] ">
        <p className="font-medium text-sm">Country: </p>
        <p className="text-sm p-[2px]">{country}</p>
      </div>
    </div>
  );
}
//

///////////////////////////////////
//           UTILS
//////////////////////////////////
// Utility function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

// Utility function to format numbers with commas
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-US").format(num);
};
