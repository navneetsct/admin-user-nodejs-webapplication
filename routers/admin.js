const express=require("express")
const adrouter=express.Router()
const mongoose=require("mongoose")
const {usersModel} = require("../routers/router")
const bcrypt=require("bcrypt")

// connecting mongoose

adrouter.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/users").then(console.log("done"));
const userschema=new mongoose.Schema({
    username:String,
    password:String,})


// creating model

const adminsModel=new mongoose.model("admins",userschema)

// authentication checking function

function adSignIn(req, res, next) {
    if (req.session.isadAuth) {
      next();
    } else {
      res.redirect("/admin");
    }
  }

// first route
adrouter.get("/",async(req,res)=>{
    console.log(req.session.isadAuth);
    if(req.session.isadAuth){
        console.log("shariyahnui");

    res.redirect("/admin/adhome")
    }else{
        console.log("thett");

        res.render("admin")
    }
})



// admin login router
adrouter.post("/adminlogin",async (req,res)=>{
    try{
        // email checking

        const data=await usersModel.findOne({username:req.body.username})
        if(data.username==req.body.username){
            
            const passwordCorrect=await bcrypt.compare(
                req.body.password,
                data.password
            );
            if(passwordCorrect){

                req.session.isadAuth=true;
                
                res.redirect("/admin/adhome");
            }else{
                
                res.render("admin",{perror:"Invalid Password"})
            }
        }
    }catch{
        res.render("admin",{perror:"Inavlid username"})
        const error="ERROR!";
        console.log(error);
    }
})

//admin logout route
adrouter.get("/adminlogout",(req,res)=>{
    console.log(req.session.isadAuth);
    req.session.isadAuth=false;
    res.redirect("/admin");
})

// admin adduser route
adrouter.route("/adduser").get(adSignIn,async (req,res)=>{
    res.render("adduser")
})

// admin aduser submission route

 adrouter.post("/adusersubmit",adSignIn, async (req,res)=>{
    if(req.session.isadAuth){
        const emailExist= await usersModel.findOne({email:req.body.password});
    if(emailExist){
        res.render("adduser",{emailExist:"e-mail Already Exist"})
    }else{
        const{username,email,password}=req.body;
        const hashedpassword= await bcrypt.hash(req.body.password, 10)
        await usersModel.insertMany([
            {username:username,email:email,password:hashedpassword}
        ])
        res.redirect("/admin/adhome");
    }

    }else{
        res.redirect("/admin");
    }
 })

//  admin home router
adrouter.route("/adhome")
.get(async (req,res)=>{
    
    if(req.session.isadAuth){
        const data = await usersModel.find({});
        res.render("adminpanel",{user:data})
    }else{
      res.redirect("/admin")  
    }
})
.post(adSignIn,async(req,res)=>{
    if(req.session.isadAuth){
        const name=req.body.search;
        const data=await usersModel.find({
            username:{$regex:new RegExp(name,'i')},
        });
        res.render("adminpanel",{user:data});
    }else{
        res.redirect("/admin");
    }
});
adrouter.get("/delete/:email",adSignIn,async (req,res)=>{
    if(req.session.isadAuth){
        const userid=req.params.email;
        await usersModel.deleteOne({email:userid});
        res.redirect("/admin/adhome");
    }else{
        res.redirect("/admin/adhome")
    }
})
adrouter.get("/update/:email",adSignIn,async(req,res)=>{
    if(req.session.isadAuth){
        const useremail=req.params.email;
        const user =await usersModel.findOne({email:useremail});
        res.render("update",{data:user})
    }else{
        res.redirect("/admin")
    }
})
adrouter.post("/update/:email",adSignIn,async (req,res)=>{
    if(req.session.isadAuth){
        const useremail=req.params.email;
        const user = await usersModel.findOne({email:useremail})
        const emailExist= await usersModel.findOne({$and:[{email:req.body.email},{email:{$ne:useremail}}]})
        if(emailExist){
            res.render("update",{data:user,emailExist:"Email Already Exists"})
        }
        else{
            await usersModel.updateOne(
                {email:useremail},
                {username:req.body.username,email:req.body.email}
            )
            res.redirect("/admin/adhome")
        }
    }
    else{
    res.redirect("/admin")
    }
})

module.exports= adrouter