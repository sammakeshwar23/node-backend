require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { error } = require("console");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*",
    methods:["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type"]
}));
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","GET","POST","PUT","DELETE")
    res.header("Access-Control-Allow-Headers","Content-Type,Authorization")
    next();
})

mongoose.connect("mongodb+srv://shubhammakeshwar23:330qAq7u8PXwAcz9@cluster0.ayrhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&tls=true", { useNewUrlParser: true, useUnifiedTopology: false }).then(() => console.log("Mongodb connected")).catch(error => console.log(error))

const companySchema = new mongoose.Schema({ name: String, city: String });

const userSchema = new mongoose.Schema({ name: String, email: String, phone: String, 
    companies: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Company"
}] });

const Company = mongoose.model("Company",companySchema);

const User = mongoose.model("User",userSchema);


app.get("/companies",async(req , res) => {
    const companies = await Company.find()
    res.send(companies)
})

app.get("/users",async(req , res) => {
    const users = await User.find().populate("companies")
    res.send(users)
})

app.post("/allocate-user",async(req , res) => {
    const { userId, companyId } = req.body;

    const user = await User.findById(userId);
    if(!user){
        return res.status(404).send({ message: "User not found" })
    }
    user.companies = companyId;
    await user.save();
    res.status(200).send({ message: "User allocated successfully"})
})

app.listen(5000,()=>{
    console.log("Server running on port 5000")
})