"use client";

// import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { useEffect, useState } from "react";

import * as z from "zod";
import { CreateCentralForm } from "../forms/centrals/CreateCentralForm";
import { ValidateCreateCentralProfileSchema } from "../forms/centrals/CreateCentralFormSchema";
import { useAddDepartmentToCentralStore } from "@/providers/AddDepartmentToCentral.Provider";
import { Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CentralOnboardingComponent() {
  const [hasUserFilledForm, sethasUserFilledForm] = useState<boolean>(false);

  const [formDetails, setFormDetails] = useState<z.infer<
    typeof ValidateCreateCentralProfileSchema
  > | null>(null);


const { clearSelectedDepartments } = useAddDepartmentToCentralStore( state => state)
  

  useEffect(() => {
    if (formDetails && hasUserFilledForm) {
      const createDepartment = async () => {
        // save the form details in the database
        console.log("here are all the form data submitted", formDetails);

        // save form details in database
          let createCentralResponse;

          const central_systems_base_api =
            process.env.NEXT_PUBLIC_CENTRAL_SYSTEMS_BASE_API;

          // let the user know that we are creating the profile
          toast({
            title: "Onboarding Central",
            description: (
              <div className="mt-2 rounded-md w-full flex justify-center items-center">
                <span>Central is being onboarded...</span>
              </div>
            ),
          });

          //  create central details in db
          await fetch(
            `${central_systems_base_api}/api/profiles/centrals/create`,
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
              createCentralResponse = await response.json();

              console.log(
                "reponse from database create central",
                createCentralResponse
              );

              if (createCentralResponse?.success) {
                // alert user that upload to cloudinary suceeded for passport
                toast({
                  title: "Central onboarded",
                  description: (
                    <div className="mt-2 w-full flex justify-center items-center rounded-md">
                      <span className="text-green-600 mr-2">
                        <Check />
                      </span>
                      <span>{createCentralResponse.message}</span>
                    </div>
                  ),
                });

                // store the passport url in a state

                // upload the signature after that
              } else {
                toast({
                  title: "Could not onboard central",
                  description: (
                    <div className="mt-2 w-full flex justify-center items-center">
                      <span className="text-red-500 mr-2">
                        <X />
                      </span>
                      <span>{createCentralResponse.message}</span>
                    </div>
                  ),
                });
              }
            })
            .catch((createCentralError) => {
              console.log(
                "failed to create central profile in database ",
                createCentralError
              );

              toast({
                title: "Onboard central Error",
                description: (
                  <div className="mt-2 w-full flex justify-center items-center">
                    <span className="text-red-500 mr-2">
                      <X />
                    </span>
                    <span>Could not onboard central.</span>
                  </div>
                ),
              });
            })
            .finally(() => {
              //  clear the state
              setFormDetails(null);
              sethasUserFilledForm(false);
              clearSelectedDepartments()
            });
  
      };

      createDepartment();
    }
  }, [formDetails , hasUserFilledForm]);

  console.log(formDetails)
  return (
    <div>
      {/* <DashboardNavbar /> */}

      <div className="mt-4">
        <div className="w-full justify-center items-center flex">
          <span className="text-primarycol text-center text-2xl">
            Create a Central
          </span>
        </div>
      </div>

      <div className="px-2 mb-10 mt-4">
        <CreateCentralForm
          isMutatingDbResource={hasUserFilledForm}
          isMutatingDbResourceHandler={sethasUserFilledForm}
          updateCreateCentralDetailsHandler={setFormDetails}
        />

      </div>
    </div>
  );
}
