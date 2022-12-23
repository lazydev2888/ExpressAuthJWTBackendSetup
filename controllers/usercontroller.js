import UserModel from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";



// =======================User Registration Function with JWT Function========================
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
                         const user = await UserModel.findOne(
                             {email:email})
                            // Generate = JWT Token
                            const token = jwt.sign({userID: user._id},
                                process.env.JWT_SECRET_KEY, { expiresIn : '5d' } )
                                res.status(201).send({ "status" : "success", "message": "Registration Success", "token": token})
                    } catch (error) {
                        console.log(error)
                        res.send({ "status": "failed", "message": "Unable to Register" })

                    }
                } else {
                    res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
                }
             } else {
                 res.send({ "status": "failed", "message": "All fields are required" })
             }
        }
    }


    // ===========================User Login Function With JWT Token=======================
    static userLogin = async (req, res) =>{
        try{
            const { email, password } = req.body
            if(email, password){
                const user = await UserModel.findOne({email : email})
                if(user != null ){
                    const isMatch = await bcrypt.compare(password, user.password)
                    if((user.email === email) && isMatch ){
                    //    Generater JWT ToKen
                    const token = jwt.sign({userID: user._id},
                        process.env.JWT_SECRET_KEY, { expiresIn : '5d' } )
                    res.send({"status": "success", "message": "Login Sucess", "token" : token})
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
    // =======================Change Password Function=========================

    static changeUserPassword = async(req,res)=>{
        const {password, password_confirmation} = req.body
        if(password && password_confirmation) {
            if(password !== password_confirmation){
             res.send({ "status" : "failed", "message": "New Password and confirm New Password doesn't match"})   
            }else{
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
            }

        }else{
            res.send({"status": "failed", "message": "All fienlds are Required"})
        }
    }


}

export default UserController


