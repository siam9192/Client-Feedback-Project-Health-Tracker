import { model, Schema } from "mongoose";
import {  Admin, Client, Employee, Gender, User, UserRole, UserStatus } from "./user.interface";


const UserModelSchema = new Schema<User> ({
    email:{
        type:String,
        unique:true,
        minLength:3,
        maxLength:100,
        required:true,
    
    },
     password:{
        type:String,
        required:true
    },
    role:{
        enum:Object.values(UserRole),
        required:true
    },

    status:{
       enum:Object.values(UserStatus)  
    },

    profileId:{
        type:Schema.ObjectId,
        required:true
    }

},{
    timestamps:true
})


const EmployeeModelSchema  = new Schema<Employee>({
    userId:{
       type:Schema.ObjectId,
       unique:true,
       required:true
    },
    user:{
        type:Schema.ObjectId,
        ref:'user',
        unique:true,
        required:true,
        select:false
    },
    name:{
        type:String,
        minLength:2,
        maxLength:30,
        trim:true,
        required:true
    },
      position:{
        type:String,
        minLength:2,
        maxLength:30,
        trim:true,
        required:true
    },
    gender:{
        type:String,
        gender:Object.values(Gender),
        required:true
    },
    profilePicture:{
        type:String,
        default:null
    },
 count: {
  runningProjects: {
    type: Number,
    min: 0,
    default: 0
  },
  completedProjects: {
    type: Number,
    min: 0,
    default: 0
  }
}

},{
    timestamps:true
}) 


const ClientModelSchema  = new Schema<Client>({
     userId:{
       type:Schema.ObjectId,
       unique:true,
       required:true
    },
    user:{
        type:Schema.ObjectId,
        ref:'user',
        unique:true,
        required:true,
        select:false
    },
    name:{
        type:String,
        minLength:2,
        maxLength:30,
        trim:true,
        required:true
    },
    
    gender:{
        type:String,
        gender:Object.values(Gender),
        default:null,
        nullable:true
    },
    profilePicture:{
        type:String,
        default:null
    },
 count: {
  runningProjects: {
    type: Number,
    min: 0,
    default: 0
  },
  completedProjects: {
    type: Number,
    min: 0,
    default: 0
  }
}

},{
    timestamps:true
}) 


const AdminModelSchema  = new Schema<Admin>({
     userId:{
       type:Schema.ObjectId,
       unique:true,
       required:true
    },
    user:{
        type:Schema.ObjectId,
        ref:'user',
        unique:true,
        required:true,
        select:false
    },
    name:{
        type:String,
        minLength:2,
        maxLength:30,
        trim:true,
        required:true
    },
    
    gender:{
        type:String,
        gender:Object.values(Gender),
        default:null,
        nullable:true
    },
    profilePicture:{
        type:String,
        default:null
    },
 count: {
  runningProjects: {
    type: Number,
    min: 0,
    default: 0
  },
  completedProjects: {
    type: Number,
    min: 0,
    default: 0
  }
}

},{
    timestamps:true
}) 


export const UserModel =  model<User>("user",UserModelSchema)

export const AdminModel = model  <Admin>("admin",AdminModelSchema)
export const EmployeeModel = model  <Employee>("employee",EmployeeModelSchema)
export const ClientModel = model  <Client>("employee",ClientModelSchema)