
"use client";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
// import { TIndividualProfile } from "@/components/forms/individuals/IndividualOnboardingFormSchema";

const DepartmentMembersListWrapper = () => {
  const [loading, setLoading] = useState<boolean>(true);
  // const [fetchedIndividuals, setFetchedIndividuals] = useState<
  //   TIndividualProfile[]
  // >([]);
  useEffect(() => {
    const fetchAllIndividuals = async () => {
      const central_systems_base_api =
        process.env.NEXT_PUBLIC_CENTRAL_SYSTEMS_BASE_API;

      await fetch(
        `${central_systems_base_api}/api/profiles/individuals/fetch/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then(async (response) => {
          const allIndividualsResponse = await response.json();

          console.log("all individuals ", allIndividualsResponse);

          if (
            allIndividualsResponse?.success &&
            allIndividualsResponse?.data &&
            allIndividualsResponse.data?.allProfiles
          ) {
            // add the individuals data to the store
            // setFetchedIndividuals(allIndividualsResponse.data.allProfiles);
          }
        })
        .catch((fetchError) => {
          console.log(
            "error fetching all individuals in AddMembers component ",
            fetchError
          );
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchAllIndividuals();
  }, []);

  return (
    <div>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        // <IndividualsTable individuals={fetchedIndividuals} />
        <></>
      )}
    </div>
  );
};

export default DepartmentMembersListWrapper;
