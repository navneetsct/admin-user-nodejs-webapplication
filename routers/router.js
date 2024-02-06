const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt")


router.use(express.urlencoded({extended:true}));

// connecting mongoose
mongoose.connect("mongodb://localhost:27017/users").then(console.log("done"));
const userschema =new mongoose.Schema({
    username:String,
    email:String,
    password:String,
});
const usersModel = new mongoose.model("details", userschema);
// get methods

// to display the login 
router.get("/",(req,res)=>{
    if(req.session.user){
     res.redirect("/home")
    }else{
        res.render("login")
    }
})



function userLoginVerify(req,res,next){
    if(req.session.user){
        next()
    }else{
        res.redirect("/")
    }
}

router.get("/signup",(req,res)=>{
    if(req.session.user){
    res.redirect("/home")
    }else{
        res.render("signup")
    }
})


// post method of login 
router.post("/login",async(req,res)=>{
    try{
    const user=await usersModel.findOne({username:req.body.username})
    console.log(user)
    const passwordCorrect=await bcrypt.compare(
        req.body.password,
        user.password
    );
    console.log(passwordCorrect,"password corrct");
    if(passwordCorrect){
        // req.session.user=req.session.username;
        req.session.user=true;
        res.redirect("/home");
    }else{
        res.render("login",{perror:"Invalid Password"})
    }
  
}catch{
    res.render("login",{unerror:"Invalid username!"})
}
});



//post method of signup

router.post("/signuppost",async(req,res)=>{
    const emailExist=await usersModel.findOne({email:req.body.email})
    if(emailExist){
        res.render("signup",{emailExist:"e-mail Already Exist"})
    }else{
        const hashPassword = await bcrypt.hash(req.body.password,10)
        const{username,email,password}=req.body;
        await usersModel.insertMany([{username:username,email:email,password:hashPassword}]);
        req.session.user=true;

        res.redirect("/home")
    }
})

router.get("/home", userLoginVerify, (req, res) => {
    if (req.session.user) {
        const cardContents = [
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://img.freepik.com/free-photo/majestic-mountain-range-tranquil-scene-dawn-generated-by-ai_188544-30834.jpg"
            },
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lfzQk7NraNcuS87iT_B2IOjlfFJu4x_sWg&usqp=CAU"
            },
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://www.state.gov/wp-content/uploads/2019/04/shutterstock_720444505v2-2208x1406-1.jpg"
            },
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://static.toiimg.com/photo/msid-89349701,width-96,height-65.cms"
            },
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkcmlkfGVufDB8fDB8fHww&w=1000&q=80"
            },
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://img.freepik.com/free-photo/majestic-mountain-range-tranquil-scene-dawn-generated-by-ai_188544-30834.jpg"
            },
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lfzQk7NraNcuS87iT_B2IOjlfFJu4x_sWg&usqp=CAU"
            },
            {
              title:"india",
              text:"in every corner of india youll find story ,in every taste theres history and in every smile teres warmth that touchesyour heart",
              urlimg:"https://www.state.gov/wp-content/uploads/2019/04/shutterstock_720444505v2-2208x1406-1.jpg"
            }
        ];
        
        res.render("home", { cardContents });
    } else {
        res.redirect("/");
    }
});
// logout
router.get("/logout",(req,res)=>{
    req.session.user=false;
    res.redirect("/");
});

module.exports= { usersModel,router}










