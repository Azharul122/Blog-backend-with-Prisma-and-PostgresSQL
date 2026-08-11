// export enum otpType {
//   CHANGE_PASSWORD,
//   RESET_PASSWORD,
//   REGISTER,
// }

export interface sendOtpTypePayload {
  email: string;
  type: "CHANGE_PASSWORD" | "RESET_PASSWORD" | "REGISTER";
}
