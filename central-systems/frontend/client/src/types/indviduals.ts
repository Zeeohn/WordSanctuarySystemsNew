import { Heirarchy } from "./general"

export interface IndividualProfile  {
    name: string
    surname: string
    email: string 
    giving_number: string
    leadership_level:  Heirarchy
    lifeclass_topic: number
    lifeclass_teacher_profile_id: string
    mentor_profile_id: string
    installation_id: string;
    signature: string
    passport: string
    birthday: string
    departments: string[],
    phone_contact: string
}