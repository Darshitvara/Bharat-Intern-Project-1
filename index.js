const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const { log } = require("console")


const app = express()

dotenv.config();

const port = process.env.PORT || 3000

const username = process.env.MONGODB_USERNAME
const password = process.env.MONGODB_PASSWORD

const connectionString = `mongodb+srv://${username}:${password}@cluster0.iop93.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(connectionString,{})

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
})
const registration = new mongoose.model("Registration", registrationSchema)
app.listen(port , ()=>{
    console.log(`Application is running on port ${port}`);
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())


app.get("/",(req,res) => {
    res.sendFile(__dirname + "/pages/login.html")
})

app.post("/register",async (req,res) => {
    try{
        const {name,email,password} = req.body;
        const existingUser = await registration.findOne({email: email})
        if(!existingUser){
            //create user 
            const registrationData = new registration({
                name,
                email,
                password
            })
            await registrationData.save()
            res.redirect("/success.html")
        }
        else{
            console.log("User alread exist");
            res.redirect("/error")
            
        }
        
    }
    catch{
        res.redirect("/error.html")
    }
})

app.get("/success",(req,res) => {
    res.sendFile(__dirname + "/pages/success.html")
})
app.get("/error",(req,res) =>{
    res.sendFile(__dirname + "/pages/error.html")
})