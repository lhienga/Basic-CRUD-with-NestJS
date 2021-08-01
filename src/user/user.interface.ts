import { Document } from "mongoose";

export interface IUser extends Document{
  email: string;
  password: string;
  name: string;
  age: number;
  phoneNumber: string
}