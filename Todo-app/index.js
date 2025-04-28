const bcrypt  = require("bcrypt");
const express = require("express");
const {UserModel, TodoModel} = require("./db"); //import of db file
const { z } = require("zod")
const app  = express();


const JWT = require("jsonwebtoken")
const JWT_SECRET = "straingertoforeever"


app.use(express.json())

//create
app.post("/signup", async  function (req, res) {
    const reqBody = z.object({
        email : z.string().min(3).max(100).email(),
        name : z.string().min(3).max(20),
        password : z.string().min(3).max(50)

    })
    const  parsedDataWithSuccess = reqBody.safeParse(req.body);
    if(!parsedDataWithSuccess.success){
        res.json({
            message :  "Invalid Format",
            error: parsedDataWithSuccess.error
        })
        return
    }




    const email = req.body.email
    const password = req.body.password
    const name = req.body.name

    let errorthrown = false;

    const hashPassword  = await bcrypt.hash(password,5);//5 is  5round to make he slightly expensive thats  why we use  await

    console.log(hashPassword);
    
   await  UserModel.create({
        email:email,
        password:hashPassword,
        name:name
    })

  
  res.json({
        message : "You are signed up"
    })
}
);


//read
app.post("/signin", async function (req, res) {
    const email = req.body.email
    const password = req.body.password

    const user = await UserModel.findOne({
        email:email,
        
    });
    if(!user){
        res.status(403).json({
            message:"User does not exist in db"
        })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    

   if(passwordMatch){
    const token = JWT.sign({
        id:user._id.toString()
    },JWT_SECRET);
    res.json({
        token:token
    });

   }else{
    res.status(403).json({
        message: "Your credentials are incorrect"
    })
   }



})


function auth(req, res, next) {
    const token = req.headers.token
    const  decodedData = JWT.verify(token,JWT_SECRET)

    if(decodedData){
        req.userId = decodedData.id;
        next();
    }else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }

}

app.post("/todo", auth, function (req,  res) {
    const userId = req.userId
TodoModel.create({
    title,
    userId
})

res.json({
    userId:userId
})

})

app.get("/todos",auth, async function (req,res) {
    const userId = req.userId
const todos =  await TodoModel.find({
    userId:userId
})

    res.json({
        todos
    })
    
})

app.listen(3000);