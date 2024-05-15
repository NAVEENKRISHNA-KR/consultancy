const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const access_key = 'gdhffvbgnhdfnytfngh';
const refresh_key = 'fbngmjhrefreshsecretkey';




const SignUp = async(req,res)=>{
   const {email,password} = req.body;
   try{
      const user = await User.findOne({email});
      if(user){
        return res.status(403).send("User Already Exists");
      }
      const hashedPassword = await bcrypt.hash(password,10)
      const newUser = await User.create({email,password:hashedPassword});
      newUser.save();
      return res.status(200).send({message:"SignUp Successfully"});
   }catch(err){
    res.status(500).send(err.message)
   }
};



const SignIn = async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user)
      return res.status(404).send("User Doesn't Exists")
    try{
        const match = await bcrypt.compareSync(password, user.password);
        if (!match){
         return res.status(400).send({ message: "Invalid Password" });
        
      }
      const accessToken = jwt.sign({id:user._id,isAdmin:user.isAdmin},access_key,{expiresIn:"3d"});
      const refreshToken = jwt.sign({id:user._id},refresh_key,{expiresIn:"7d"});
      return res.status(200).send({message:"Log In Successfully",accessToken,refreshToken,email})
    }catch(err){
        res.status(500).send(err.message)
    }
 };



 

 module.exports = {SignUp,SignIn};
