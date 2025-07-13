"use client";
import { useEffect, useState } from "react";
import { extractDeptTypeSelectOptions } from "@/helpers/stateHandlers";
import { MultiSelectSearchComponent } from "./MultiSelectSearchComponent";
import { SelectWithSearchOptionType } from "./SelectSearchComponent";
import { DepartmentType } from "@/types/general";
import { useAddDepartmentMemberStore } from "@/providers/AddDeptMemberProvider";

export const SelectDepartmentTypeComponent = () => {
  const [loading, setIsLoading] = useState<boolean>(true);
  const [allDepartmentTypes, setAllDepartmentTypes] = useState<
    DepartmentType[]
  >([]);
  const [departmentTypesSelectOptions, setDepartmentTypeSelectOptions] =
    useState<SelectWithSearchOptionType[]>([]);

  const {
    setCurrentlySelectedDeptType,
    addMemberToDepartmentState: { currentlySelectedDeptType },
  } = useAddDepartmentMemberStore((state) => state);

  useEffect(() => {
    if (allDepartmentTypes.length === 0) {
      const fetchAllDepartmentTypes = async () => {
        const central_systems_base_api =
          process.env.NEXT_PUBLIC_CENTRAL_SYSTEMS_BASE_API;

        await fetch(
          `${central_systems_base_api}/api/profiles/departments/class/all`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
          .then(async (response) => {
            const allDeptTypesResponse = await response.json();

            console.log("all departmentTypes ", allDeptTypesResponse);

            if (
              allDeptTypesResponse?.success &&
              allDeptTypesResponse?.data &&
              allDeptTypesResponse.data.departmentClasses
            ) {
              // add the individuals data to the store
              setAllDepartmentTypes(
                allDeptTypesResponse.data.departmentClasses
              );

              // transform the fetched data to what the select component can handle and storeit in the store
              setDepartmentTypeSelectOptions(
                extractDeptTypeSelectOptions(
                  allDeptTypesResponse.data.departmentClasses
                )
              );
            }
          })
          .catch((fetchError) => {
            console.log(
              "error fetching all department types in SelectDepartmentType component ",
              fetchError
            );
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

      fetchAllDepartmentTypes();
    }

  }, []);

  return (
    <div>
      <MultiSelectSearchComponent
        placeholderSearchText={
          loading ? "Fetching..." : "Search Department types"
        }
        placeholderText="Select Department type"
        searchEmptyText="No type matched"
        selectedValue={currentlySelectedDeptType}
        setSelectedValue={setCurrentlySelectedDeptType}
        options={departmentTypesSelectOptions}
      />

      {/* <SelectInstallation
         
        /> */}
    </div>
  );
};
