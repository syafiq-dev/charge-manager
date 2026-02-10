import React from "react";
import NavBarSection from "./sections/NavBarSection";
import TableSection from "./sections/TableSection";
import Footer1 from "@/components/Footer1";

const page = () => {
  return (
    <div className="bg-neutral-100">
      <NavBarSection />
      <TableSection />
      <Footer1
        website="supersharkz.com"
        handle="Syafiq Saharudin"
        websiteDescription="Charge Administration"
      />
    </div>
  );
};

export default page;
