export enum InstallationMemberRoles {
  HEAD_OF_INSTALLATION = "INSTALLATION HEAD",
  HEAD_WORKER = "HEAD WORKER",
  MINISTER_IN_CHARGE = "MINISTER",
  LEADER = "LEADER",
  WORKER = "WORKER",
  MEMBER = "MEMBER",
}

export type InstallationMember = {
  profile_id: string;
  role: InstallationMemberRoles;
};

export type Dues = {
  PASTOR: number;
  MINISTER: number;
  HOD: number;
  ASSISTANT_HOD: number;
  EXECUTIVE_ASSISTANT: number;
  WORKER: number;
  MEMBER: number;
};

export enum Heirarchy {
  PASTOR = "PASTOR",
  MINISTER = "MINISTER",
  HOD = "HOD",
  ASSISTANT_HOD = "ASSISTANT_HOD",
  EXECUTIVE_ASSISTANT = "EXECUTIVE_ASSISTANT",
  WORKER = "WORKER",
  MEMBER = "MEMBER",
}

// export enum LeadershipLevel {

// }
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export type DeptMember = {
  role: DeptMemberRole;
  profile_id: string;
};

export enum DeptMemberRole {
  HEAD_OF_DEPARTMENT = "HEAD OF DEPARTMENT",
  ASSISTANT_HEAD_OF_DEPARTMENT = "ASSISTANT HEAD OF DEPARTMENT",
  EXECUTIVE_ASSISTANT = "EXECUTIVE ASSISTANT",
  EVANGELISM_ASSISTANT = "EVANGELISM ASSISTANT",
  PRAYER_ASSISTANT = "PRAYER ASSISTANT",
  FINANCE_ASSISTANT = "FINANCE ASSISTANT",
  WORKER = "WORKER",
  MEMBER = "MEMBER",
}

export type DepartmentInCentralType = {
  department_type: string;
  department_id: string;
};

export enum DepartMentNames {
  MEDIA = "MEDIA",
  POWER_AND_SOUND = "POWER AND SOUND",
  CHOIR = "CHOIR",
  DECORATION = "DECORATION",
  PUBLISHERS = "PUBLISHERS",
  SID = "SANCTUARY INTELLIGENCE DEPARTMENT",
  EVANGELISM = "EVANGELISM",
}

export interface DepartmentType {
  department_class_id: string;
  department_class_name: string;
  description: string;
  createdAt: Date;
  modifiedAt: Date;
}

export type UserData = {
  username: string;
  title: string;
};

export interface KPIData {
  finance: number;
  people: number;
  operation: number;
  improvement: number;
  location: string;
}

export interface KPICardProps {
  data: KPIData[]; // Accepts an array
  isLoading?: boolean;
  error?: string | null;
}

export type Member = {
  name: string;
  installment: string;
  position: string;
};

type Status = "Sent" | "Registered" | "Accepted" | "Declined";

export type InvitationStatus = "Sent" | "Registered" | "Accepted" | "Declined";

export interface InvitationsTable {
  name: string;
  email: string;
  position: string;
  status: Status;
}

export type AccessRequest = {
  name: string;
  installment: string;
  position: string;
};

type TrendDirection = "up" | "down";

export interface Department {
  name: string;
  members: number;
  kpi: number;
  trend: TrendDirection;
}
