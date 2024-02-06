const express=require('express');
const app=express();
const session=require('express-session');
const nocache = require('nocache');
const {router} = require("./routers/router")
const adrouter= require("./routers/admin")
// const mongoose=require('mongoose')
// view engine setting

app.set("view engine","hbs");
app.use(express.static(__dirname+"/public"));
app.use(express.urlencoded({extended:true}));

//session and cache 


app.use(nocache());
app.use(
    session({
    secret:"your-secreat-key",
    resave:false,
    saveUninitialized :true,
}));

//  router connect

 app.use("/",router)
 app.use("/admin",adrouter)
 
 app.get("*",(req,res)=>{
    res.status(404).send("page not found")
 })
 
app.listen(8000,()=>console.log("http://localhost:8000"));
