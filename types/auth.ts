import { BloodGroup, Gender, MaritalStatus } from "../generated/prisma/enums";

export interface sendOtpTypePayload {
  email: string;
  type: "CHANGE_PASSWORD" | "RESET_PASSWORD" | "REGISTER";
}

export interface userEditableFields {
  phone?: string;
  address?: string;
  name?: string;
  bloodGroup: BloodGroup;
  gender: Gender;
  maritalStatus: MaritalStatus;
  dateOfBirth: Date;
  bio: string;
  website: string;
  profileImage: string;
  coverImage: string;
}
