const { Router } = require("express");

const userRouter = Router();
const {  userModel }  = require("../db");

const jwt = require("jsonwebtoken");
const  {JWT_USERKEY} = require("/..config");

const bcrypt = require("bcrypt");
const {z} = require("zod");

userRouter.post("/signup",async function(req,res){
    // schema of zod
    const requiredbody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(5).max(30),
        firstName: z.string().max(100),
        lastName: z.string().max(100)
    })
    // input for signup
    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;


    const parseddatawithsuccess = requiredbody.safeParse(req.body);

    if(!parseddatawithsuccess.success) {
        res.json({
            message: "incorrect format",
            error: parseddatawithsuccess.error
        })
    }
    function sendResponse(res,status,message) {
        res.status(status).json({message});
    }

    try{
    const hashedPassword = await bcrypt.hash(password,5);
    await userModel.create({
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName
    });
    return sendResponse(res,200,"You are Signed up");
    } catch(e) {
        return sendResponse(res,500,"User already Exists");
        
    } 
     
});

userRouter.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    try{
    const user = await userModel.findOne({
        email:email 
    })
    if(!user) {
        return res.json({
            message: "user does not exist"
        })
    }

    const passwordMatch = await bcrypt.compare(password , user.password);
    if(passwordMatch) {
        const token = jwt.sign({
            id : user._id
        }, JWT_USERKEY);
        return res.json({
            token:token
        });
    } else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
    } catch(e) {
        return res.status(500).json({
            message : "Failed to create token"
        });
    }


});

userRouter.get("/purchases", userMiddleware, async function(req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = { 
    userRouter: userRouter
}
    