import React, { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  ArrowDown,
  LucideIcon,
  SearchIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { IconType } from "react-icons/lib";
import {
  IoAdd,
  IoNotifications,
  IoPerson,
  IoSettings,
  IoLogOut,
} from "react-icons/io5";
import { toast } from "sonner";

export interface SingleDropDownOption {
  icon?: ReactNode;
  value: string;
  label: string;
  onSelect?: () => void;
  className?: string;
}

interface AvatarAreaProps {
  username?: string;
  avatarUrl?: string;
  avatarFallback?: string;
  showAvatar?: boolean;
  selectOptions?: Array<SingleDropDownOption>;
  onSelectChange?: (value: string) => void;
  selectPlaceholder?: string;
}

interface NavbarProps {
  leftSection?: ReactNode;
  className?: string;
  buttonData?: {
    text?: string;
    icon?: LucideIcon | IconType;
    onClickedBtn?: () => void;
    className?: string;
  };
  searchProps?: {
    value: string;
    onChange: (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    placeholder: string;
  };
  showSearchBar?: boolean;
  iconButtons?: Array<ReactNode>;
  rightSection?: Array<ReactNode>;
  avatarArea?: AvatarAreaProps;
}

const DEFAULT_SELECT_OPTIONS = [
  {
    value: "profile",
    label: "View Profile",
    icon: <IoPerson />,
  },
  {
    value: "settings",
    label: "Settings",
    icon: <IoSettings />,
  },
  { value: "logout", label: "Logout", icon: <IoLogOut /> },
];

export default function DashboardNavBar1({
  className = "",
  searchProps = {
    value: "",
    placeholder: "Search Anything",
    onChange: () => {},
  },
  buttonData,
  leftSection,
  showSearchBar = true,
  rightSection,
  iconButtons = [
    <div key={"notifIcon"}>
      <IoNotifications />
    </div>,
  ],
  avatarArea,
}: NavbarProps) {
  const [open, setOpen] = useState(false);

  const mergedButtonData = {
    ...{
      text: "Add New",
      icon: IoAdd,
      onClickedBtn: () => {},
      className: "",
    },
    ...buttonData,
  };

  const mergedAvatarArea: AvatarAreaProps = {
    ...{
      username: "Alex",
      avatarUrl: "",
      avatarFallback: "Ax",
      showAvatar: true,
      selectOptions: DEFAULT_SELECT_OPTIONS,
      selectPlaceholder: "Select option",
      onSelectChange: (value) => {
        toast.info("Coming Soon", {
          description: "Work In Progress...",
          position: "bottom-right",
          className: "!bg-blue-400 !text-white",
          classNames: {
            description: " !text-neutral-100",
          },
        });
      },
    },
    ...avatarArea, // 👈 your overrides
  };

  const handleSelectChange = (value: string) => {
    // Find the selected option and call its onSelect function if it exists
    const selectedOption =
      mergedAvatarArea.selectOptions?.find(
        (option) => option.value === value,
      );
    if (selectedOption?.onSelect) {
      selectedOption.onSelect();
    }
    // Also call the general onSelectChange if provided
    if (mergedAvatarArea.onSelectChange) {
      mergedAvatarArea.onSelectChange(value);
    }
  };

  return (
    <Card
      className={`w-full bg-yellow-300 rounded-none shadow-none px-4 py-5 grid grid-cols-2 items-center ${className}`}
    >
      {/* Left side - Welcome message */}
      <div className="justify-self-start">
        {!leftSection ? (
          <div className="flex items-center text-xl max-md:hidden">
            <h2 className="font-bold">Welcome Back</h2>
            <h2 className="font-normal px-1">
              {mergedAvatarArea.username}
            </h2>
          </div>
        ) : (
          <>{leftSection}</>
        )}
      </div>

      {/* Right side - Icons and profile */}
      <div className="justify-self-end flex items-center space-x-4">
        {showSearchBar && (
          <div className="items-center mx-4 relative w-full flex-1">
            <div className="absolute left-3 top-3 text-gray-400">
              <SearchIcon size={16} />
            </div>
            <Input
              className="pl-9 h-10 border"
              placeholder={searchProps.placeholder}
              onChange={searchProps.onChange}
              value={searchProps.value}
            />
          </div>
        )}

        <div className="flex justify-center items-center gap-4">
          {rightSection?.map((node, index) => (
            <div className="opacity-55 px-0" key={index}>
              {node}
            </div>
          ))}
        </div>

        <Button
          onClick={
            mergedButtonData.onClickedBtn &&
            mergedButtonData.onClickedBtn
          }
          className={`h-10 shadow-none ${mergedButtonData.className}`}
        >
          <mergedButtonData.icon />
          <span className="max-sm:hidden">
            {mergedButtonData.text}
          </span>
        </Button>
        <Separator
          className="h-1 w-0"
          orientation="vertical"
        />

        <div className="flex justify-center items-center gap-4">
          {iconButtons.map((icon, index) => (
            <div className="opacity-55 px-0" key={index}>
              {icon}
            </div>
          ))}
        </div>

        {mergedAvatarArea.showAvatar && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className=" hover:bg-transparent "
              >
                <Avatar className="h-9 w-9 border  border-gray-200">
                  <AvatarImage
                    src={mergedAvatarArea.avatarUrl}
                    alt={mergedAvatarArea.username}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-800 text-sm">
                    {mergedAvatarArea.avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <IoIosArrowDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-fit p-0"
              align="start"
            >
              <Command>
                <CommandList>
                  <CommandGroup
                    heading={mergedAvatarArea.username}
                  >
                    {mergedAvatarArea.selectOptions?.map(
                      (option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            handleSelectChange(
                              option.value,
                            );
                            setOpen(false); // Close popover on select
                          }}
                          className={`cursor-pointer pr-4 h-10 justify-center flex flex-col ${option.className}`}
                        >
                          <div className="flex items-center gap-2 w-full">
                            <span className="opacity-70">
                              {option.icon}
                            </span>
                            <span>{option.label}</span>
                          </div>
                        </CommandItem>
                      ),
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </Card>
  );
}
