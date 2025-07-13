import { DeptMember, Dues } from "./general";

export interface DepartmentalProfile {
    department_name: string;
    description: string;
    finance_id: string;
    department_type: string;
    members: DeptMember[];
    dues_paid_per_individual: Dues[];
    installation_id: string;
    createdAt: string;
    modifiedAt: string;
  }