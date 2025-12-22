import { Document, ObjectId } from "mongoose";


export interface CreateUserPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

export type UpdateUserProfilePayload = Partial<{
  name: string;
  profilePhoto: string;
  gender: Gender;
}>;

export type UsersFilterQuery = { searchTerm?: string };


export interface User extends Document {

  email: string;
  password: string;
  role: UserRole
  status:UserStatus
  profileId:ObjectId
  
  createdAt:Date,
  updatedAt:Date

}


export enum UserStatus {
 ACTIVE  = "active",
 BLOCKED = "blocked"
}


export enum UserRole  {
 ADMIN = "admin",
 EMPLOYEE = "employee",
 CLIENT = "client"
}


export interface Admin extends Document   {
  userId:ObjectId
  user?:User
  name:string
  gender:Gender|null,
  profilePicture:string|null
  count:{
    runningProjects:number,
    completedProjects:number
  },

  createdAt:Date,
  updatedAt:Date

}


export interface Employee extends Document   {
  userId:ObjectId
  user?:User
  name:string
  position:string
  gender:Gender|null,
  profilePicture:string|null
  count:{
    runningProjects:number,
    completedProjects:number
  },

  createdAt:Date,
  updatedAt:Date

}



export interface Client {
  userId:ObjectId,
  user?:User
  name:string
  gender:Gender|null,
  profilePicture:string|null
  count:{
    runningProjects:number,
    completedProjects:number
  }
}


export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER  = "other"
}