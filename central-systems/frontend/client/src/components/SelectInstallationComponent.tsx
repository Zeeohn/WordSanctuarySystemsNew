"use client";
import { useEffect, useState } from "react";
import { useAddMemberStore } from "@/providers/AddMembersStoreProvider";
import { TCreateInstallationProfile } from "./forms/installations/InstallationOnBoardingFormSchema";
import { extractInstallationsSelectOptions } from "@/helpers/stateHandlers";
import { MultiSelectSearchComponent } from "./MultiSelectSearchComponent";
import { SelectWithSearchOptionType } from "./SelectSearchComponent";

export const SelectInstallationComponent = () => {
  const [loading, setIsLoading] = useState<boolean>(true);
  const [allInstallationsProfiles, setAllInstallationsProfiles] = useState<
    TCreateInstallationProfile[]
  >([]);
  const [installationsSelectOptions, setInstallationsSelectOptions] = useState<
    SelectWithSearchOptionType[]
  >([]);

  const {
    setCurrentlySelectedInstallation,
    addMemberToinstallationState: { currentlySelectedInstallation },
  } = useAddMemberStore((state) => state);

  useEffect(() => {
    if (allInstallationsProfiles.length === 0) {
      const fetchAllInstallations = async () => {
        const central_systems_base_api =
          process.env.NEXT_PUBLIC_CENTRAL_SYSTEMS_BASE_API;

        await fetch(
          `${central_systems_base_api}/api/profiles/installations/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(async (response) => {
            const allInstallationsResponse = await response.json();

            console.log("all installation ", allInstallationsResponse);

            if (
              allInstallationsResponse?.success &&
              allInstallationsResponse?.data &&
              allInstallationsResponse.data.installations
            ) {
              // add the individuals data to the store
              setAllInstallationsProfiles(
                allInstallationsResponse.data.installations
              );

              // transform the fetched data to what the select component can handle and storeit in the store
              setInstallationsSelectOptions(
                extractInstallationsSelectOptions(
                  allInstallationsResponse.data.installations
                )
              );
            }
          })
          .catch((fetchError) => {
            console.log(
              "error fetching all individuals in AddMembers component ",
              fetchError
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

      fetchAllInstallations();
    }
  });

  return (
    <div>
      <MultiSelectSearchComponent
        placeholderSearchText={
          loading ? "Fetching installatons..." : "Search Installations"
        }
        placeholderText="Select Installation"
        searchEmptyText="No Installation matched"
        selectedValue={currentlySelectedInstallation}
        setSelectedValue={setCurrentlySelectedInstallation}
        options={installationsSelectOptions}
      />

      {/* <SelectInstallation
         
        /> */}
    </div>
  );
};
