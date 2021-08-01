import { Document } from "mongoose";

export interface IOtherUser extends Document{
  email: string;
  name: string;
  age: number;
}