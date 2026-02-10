"use client";

import DashboardNavBar1 from "@/components/NavBar1";
import { useRouter } from "next/navigation";
import React from "react";

const NavBarSection = () => {
  const { push } = useRouter();
  return (
    <div>
      <DashboardNavBar1
        buttonData={{
          text: "New Charge",
          onClickedBtn: () => {
            push("/charge-creator");
          },
          className: "",
        }}
        iconButtons={[]}
        showSearchBar={false}
      />
    </div>
  );
};

export default NavBarSection;
