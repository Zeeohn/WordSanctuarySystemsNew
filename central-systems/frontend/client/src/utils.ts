import { Gender, Heirarchy } from "./types/general";

export function removeProfileId(input: string): string {
  // Regular expression to match 'profileId' followed by its value
  const regex = /profileId\s+[a-zA-Z0-9]+/;
  return input.replace(regex, "").trim(); // Remove the matched part and trim extra spaces
}

export function extractProfileIdHelper(input: string): string | null {
  const regex = /profileId\s+([a-zA-Z0-9]+)/;
  const match = input.match(regex);
  return match ? match[1] : null; // Returns the profileId or null if not found
}

export function formatMemberName(
  memberName: string,
  shouldTruncate: boolean
): string {
  // Ensure the first letter is uppercase and the rest are lowercase

  // Check the length and add ellipses if necessary
  if (memberName.length > 17 && shouldTruncate) {
    return memberName.slice(0, 15) + "..."; // Truncate and add ellipses
  }

  return memberName; // Return formatted name if not truncated
}

export function extractAlphanumeric(str: string) {
  // Use regular expression to match only alphanumeric characters
  return str.replace(/[^a-zA-Z0-9]/g, "");
}

export const lifeClassTopicsSelectComponentPayload = [
  {
    name: "1",
    value: "1",
  },
  {
    name: "2",
    value: "2",
  },
  {
    name: "3",
    value: "3",
  },
  {
    name: "4",
    value: "4",
  },
  {
    name: "5",
    value: "5",
  },
  {
    name: "6",
    value: "6",
  },
  {
    name: "7",
    value: "7",
  },
  {
    name: "8",
    value: "8",
  },
  {
    name: "9",
    value: "9",
  },
  {
    name: "10",
    value: "10",
  },
  {
    name: "11",
    value: "11",
  },

  {
    name: "12",
    value: "12",
  },
  {
    name: "13",
    value: "13",
  },
  {
    name: "14",
    value: "14",
  },
  {
    name: "15",
    value: "15",
  },
  {
    name: "16",
    value: "16",
  },
  {
    name: "17",
    value: "17",
  },
  {
    name: "18",
    value: "18",
  },
  {
    name: "19",
    value: "19",
  },
  {
    name: "20",
    value: "20",
  },
  {
    name: "21",
    value: "21",
  },
  {
    name: "22",
    value: "22",
  },
  {
    name: "23",
    value: "23",
  },
  {
    name: "24",
    value: "24",
  },
  {
    name: "25",
    value: "25",
  },
  {
    name: "26",
    value: "26",
  },
  {
    name: "27",
    value: "27",
  },
  {
    name: "28",
    value: "28",
  },
  {
    name: "29",
    value: "29",
  },
  {
    name: "30",
    value: "30",
  },
];

export const leaderShipLevelSelectComponentPayload = [
  {
    name: "Pastor",
    value: Heirarchy.PASTOR,
  },
  {
    name: "Minister",
    value: Heirarchy.MINISTER,
  },
  {
    name: "HOD",
    value: Heirarchy.HOD,
  },
  {
    name: "Assistant HOD",
    value: Heirarchy.ASSISTANT_HOD,
  },
  {
    name: "Executive Assistant",
    value: Heirarchy.EXECUTIVE_ASSISTANT,
  },
  {
    name: "Worker",
    value: Heirarchy.WORKER,
  },
  {
    name: "Member",
    value: Heirarchy.MEMBER,
  },
];

export const genderSelectComponentPayload = [
  { name: "Male", value: Gender.MALE },
  {
    name: "Female",
    value: Gender.FEMALE,
  },
];
