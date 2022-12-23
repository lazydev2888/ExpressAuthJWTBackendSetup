import { Jwt } from "jsonwebtoken";
import UserModel from "../models/User";

const checkUserAuth = async(req,res)=>