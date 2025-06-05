"use client";

// import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { useEffect, useState } from "react";

import * as z from "zod";
import { DepartmentTypeForm } from "../forms/department/DepartmentTypeForm";
import { CreateDepartmentClassFormSchema } from "../forms/department/DepartmentTypeFormSchema";
import { toast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import DashboardWelcomeComponent from "./DashboardWelcomeComponent";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export default function DepartmentTypeOnboardingComponent() {
  const [hasUserFilledForm, sethasUserFilledForm] = useState<boolean>(false);

  const [formDetails, setFormDetails] = useState<z.infer<
    typeof CreateDepartmentClassFormSchema
  > | null>(null);

  useEffect(() => {
    const createDepartmentType = async () => {
      // save the form details in the database
      console.log("here are all the form data submitted", formDetails);

      // save form details in database
      if (formDetails && hasUserFilledForm) {
        let createDepartmentTypeResponse;

        // let the user know that we are creating the profile
        toast({
          title: "Creating Department Type",
          description: (
            <div className="mt-2 rounded-md w-full flex justify-center items-center">
              <span>Department type is being created...</span>
            </div>
          ),
        });

        const central_systems_base_api =
          process.env.NEXT_PUBLIC_CENTRAL_SYSTEMS_BASE_API;

        // save the department details
        await fetch(
          `${central_systems_base_api}/api/profiles/departments/class/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formDetails,
            }),
          }
        )
          .then(async (response) => {
            // get the response of the upload
            createDepartmentTypeResponse = await response.json();

            console.log(
              "reponse from database create department type",
              createDepartmentTypeResponse
            );

            if (createDepartmentTypeResponse?.success) {
              // alert user that upload to cloudinary suceeded for passport
              toast({
                title: "Create Department Type Success",
                description: (
                  <div className="mt-2 w-full flex justify-center items-center rounded-md">
                    <span className="text-green-600 mr-2">
                      <Check />
                    </span>
                    <span>{createDepartmentTypeResponse.message}</span>
                  </div>
                ),
              });

              // store the passport url in a state

              // upload the signature after that
            } else {
              toast({
                title: "Create Department Type Error",
                description: (
                  <div className="mt-2 w-full flex justify-center items-center">
                    <span className="text-red-500 mr-2">
                      <X />
                    </span>
                    <span>{createDepartmentTypeResponse.message}</span>
                  </div>
                ),
              });
            }
          })
          .catch((createDepartmentTypeError) => {
            console.log(
              "failed to create department Type profile in database ",
              createDepartmentTypeError
            );

            toast({
              title: "Create Department Type Error",
              description: (
                <div className="mt-2 w-full flex justify-center items-center">
                  <span className="text-red-500 mr-2">
                    <X />
                  </span>
                  <span>Could not create department type.</span>
                </div>
              ),
            });
          })
          .finally(() => {
            sethasUserFilledForm(false);
            setFormDetails(null);
          });
      }
    };

    createDepartmentType();
  }, [hasUserFilledForm, formDetails]);

  return (
    <div className="mt-[50px]">
      <DashboardWelcomeComponent username={""} title={""} />

      <div className="mt-8">
        <Link href="/dashboard/onboard">
          <IoArrowBack className="h-10 w-8" />
        </Link>
        <div className="w-full justify-center items-center flex">
          <span className="text-primarycol text-center text-3xl font-bold">
            Department Type
          </span>
        </div>
      </div>

      <div className="px-5 mb-10 mt-4">
        <DepartmentTypeForm
          isMutatingDbResource={hasUserFilledForm}
          isMutatingDbResourceHandler={sethasUserFilledForm}
          updateDepartmentTypeDetailsHandler={setFormDetails}
        />
      </div>
    </div>
  );
}
