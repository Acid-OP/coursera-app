const { Router} = require("express");
const adminRouter = Router();
const { adminModel, userModel, courseModel }  = require("../db");
const  {JWT_ADMINKEY} = require("/..config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {z} = require("zod");
const { adminMiddleware } = require("../middleware/admin");


adminRouter.post("/signup",async function(req,res){
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
    await adminModel.create({
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

adminRouter.post("/signin", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    try{
    const admin = await adminModel.findOne({
        email:email
    })
    if(!admin) {
        return res.json({
            message: "user does not exist"
        })
    }

    const passwordMatch = await bcrypt.compare(password , admin.password);
    if(passwordMatch) {
        const token = jwt.sign({
            id : admin._id
        }, JWT_ADMINKEY);
        return res.json({
            token:token
        });
    } else{
        return res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
    } catch(e) {
        res.status(500).json({
            message : "Failed to create token"
        });
    }


});


adminRouter.post("/course" , adminMiddleware, async function(req,res){
    const adminId = req.userId;
    const {title , description , imageURl , price , courseId} = req.body;

    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    },{
        title: title,
        description: description,
        imageUrl: imageURl,
        price: price,
        creatorId: adminId
    })
    res.json({
        message: "course created",
        courseId: course._id
    })
});

adminRouter.get("/course/bulk" ,adminMiddleware , async function(req,res){
    const adminId = req.userId;
    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })
});

module.exports= {
    adminRouter : adminRouter
}