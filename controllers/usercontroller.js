import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc } = req.body
        const user = await UserModel.findOne({ email: email })
        if (user) {
            res.send({ "status": "failed", "message": "Email already exists" })
        } else {
            if (name && email && password && password_confirmation && tc) {
                if (password === password_confirmation) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc

                        })
                        await doc.save()
                        res.send({ "status": "Success", "message": "Registration succesfully" })
                    } catch (error) {
                        console.log(error)
                        res.send({ "status": "failed", "message": "Unable to Register" })

                    }
                } else {
                    res.staus(201).send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
                }
             } else {
                 res.send({ "status": "failed", "message": "All fields are required" })
             }
        }
    }

    static userLogin = async (req, res) =>{
        try{
            const { email, password } = req.body
            if(email, password){
                const user = await UserModel.findOne({email : email})
                if(user != null ){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch ){
                    res.send({"status": "success", "message": "Login Sucess"})
                    }else{
                        res.send({"status": "failed", "message" : "Email or Password is not valid"})
                    }
                }
                else{
                    res.send({"status": "failed", "message": "you are not a Register User" })
                }
            }else{
                 res.send({ "status": "failed", "message": "All fields are Required" })
            }
        }catch(error){
            console.log(error);
            res.send({"status": "failed", "message": "Unable to Login"})
        }
    }
}

export default UserController


