"use client";

// import { navigate } from "@/app/actions";
// import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardWelcomeComponent from "@/components/dashboard/DashboardWelcomeComponent";
import MembersHome from "@/components/dashboard/MembersHome";
// import { useProfileStore } from "@/providers/ProfileStoreProvider";
import { useEffect } from "react";

export default function MembersDashboardPage() {
  // const isLoggedIn = useProfileStore((state) => state.isLoggedIn);

  // const shouldredirect = ()=>{
  //   if(isLoggedIn){
  //       navigate("/auth/login")
  //   }
  // }
  useEffect(()=>{
    // shouldredirect() 
  })

  return (
    <div>
      {/* {isLoggedIn && ( */}
        <>
          <DashboardWelcomeComponent username={""} title={""} />
          <MembersHome />
        </>
      {/* )} */}
    </div>
  );
}
