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

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

// export enum LeadershipLevel {

// }

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
