"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { z, ZodError } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SetStateAction, Dispatch } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import {
  CreateCentralProfileSchema,
  ValidateCreateCentralProfileSchema,
} from "./CreateCentralFormSchema";
import { AddDepartmentToCentralComponent } from "@/components/AddDeptsToCentralComponent";
import { useAddDepartmentToCentralStore } from "@/providers/AddDepartmentToCentral.Provider";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";
// import SuccessModal from "@/components/SuccessModal";

interface CreateCentralFormProps {
  isMutatingDbResourceHandler: Dispatch<SetStateAction<boolean>>;
  isMutatingDbResource: boolean;
  updateCreateCentralDetailsHandler: Dispatch<
    SetStateAction<z.infer<typeof ValidateCreateCentralProfileSchema> | null>
  >;
}

export function CreateCentralForm({
  isMutatingDbResource,
  isMutatingDbResourceHandler,
  updateCreateCentralDetailsHandler,
}: CreateCentralFormProps) {
  const { selectedDepartments } = useAddDepartmentToCentralStore(
    (state) => state.addDepartmentToCentralState
  );
  // const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof CreateCentralProfileSchema>>({
    resolver: zodResolver(CreateCentralProfileSchema),
    defaultValues: {
      //
    },
  });

  const onSubmit = async (data: z.infer<typeof CreateCentralProfileSchema>) => {
    console.log("here are the values of central  form ", data);

    try {
      const submittedData = {
        ...data,
        finance_id: "none" + data.central_name, // placeholder finance id
        departments: selectedDepartments.map((dept) => ({
          department_id: dept.department_id,
          department_type: dept.department_type_id,
        })),
      };

      // validate the data to detect errors
      const validatedData =
        ValidateCreateCentralProfileSchema.parse(submittedData);

      updateCreateCentralDetailsHandler({
        ...validatedData,
      });
      isMutatingDbResourceHandler(true);
    } catch (err) {
      console.log("Error from department members form ", err);
      if (err instanceof ZodError) {
        toast({
          title: "Invalid Inputs",
          description: (
            <div className="mt-2 w-full flex justify-center items-center">
              <span className="text-red-500 mr-2">
                <X />
              </span>
              <span>{err.errors[0].message}</span>
            </div>
          ),
        });
      } else {
        toast({
          title: "Invalid Inputs",
          description: (
            <div className="mt-2 w-full flex justify-center items-center">
              <span className="text-red-500 mr-2">
                <X />
              </span>
              <span>Please make sure all data is correctly entered</span>
            </div>
          ),
        });
      }
    }
  };

  return (
    <div
      className={`${isMutatingDbResource && "pointer-events-none opacity-70"}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="central_name"
            render={({ field }) => {
              return (
                <FormItem className="mb-2">
                  <FormLabel>Central Name </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g MPCD Central" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem className="mb-2">
                  <FormLabel>Description </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="please enter some description of the central"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex justify-center items-center text-xl">
            <span>Departments</span>
          </div>

          <AddDepartmentToCentralComponent />
          <div>
            <Button
              type="submit"
              variant={"default"}
              className="bg-primarycol text-white w-full mt-2"
              // onClick={() => setIsModalOpen(true)}
            >
              Submit
            </Button>

            {/* <SuccessModal
        isVisible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite sent"
        message="Your invitation has been sent successfully"
      /> */}
          </div>
        </form>
      </Form>
    </div>
  );
}
