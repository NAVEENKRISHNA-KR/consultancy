require("dotenv").config();
require("./Google_oAuth/google_oauth");

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./Models/userModel");
const passport = require("passport");
const connectDB = require("./ConnectDB/db");
const port = 7000;
const userRouter = require("./Routers/userRoute");
const furnitureRouter = require("./Routers/furnitureRoute");
const furniturecolorRouter = require("./Routers/furnitureColorsRoute");
const access_key = process.env.access_secret_key;
const nodemailer = require('nodemailer');
const cors = require("cors")
const cartRouter = require("./Routers/cartRoute");
const notFoundURL = require("./Middlewares/notFoundURL");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    successStatus: 200,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/", userRouter);
app.use("/furniture", furnitureRouter);
app.use("/furniture-color", furniturecolorRouter);
app.use("/api/cart",cartRouter);
app.use(notFoundURL);

//Port is listening

app.listen(port,async()=>{
    await connectDB("mongodb+srv://naveenkrishnakr21cse:naveen123@cluster0.pxo5a3b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log(`Server Running on http://localhost:${port}`)
})





//Google Login

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/login/success", (req, res) => {
  console.log("User", req.user);
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "/login/failed",
  })
);



//Forgot Password

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.status(404).json({ status: "User Doesn't Exist" });
    }
    let secret = access_key + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5min",
    });
    const link = `http://localhost:7000/reset-password/${oldUser._id}/${token}`;
    console.log(link);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.status(404).json({ status: "User Doesn't Exist" });
  }
  let secret = access_key + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
    //return res.send("verified")
  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.post("/reset-password/:id/:token",async(req,res)=>{
	const {id,token} = req.params;
	const {password} = req.body;
	const oldUser = await User.findOne({_id:id});
	if(!oldUser){
	   return res.status(404).json({status:"User Doesn't Exist"})
	}
	let secret = access_key+oldUser.password;
	try{
	  const verify = jwt.verify(token,secret);
	  const encryptedPassword = await bcrypt.hash(password, 10);
	  await User.updateOne(
	    {
	      _id: id,
	    },
	    {
	      $set: {
	        password: encryptedPassword,
	      },
	    }
	  );
	  res.render("index", { email: verify.email, status: "verified" });
	}catch(err){
	   res.status(500).send(err.message)
	}
  })





