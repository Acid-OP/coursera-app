const { Router} = require("express");
const adminRouter = Router();
const { adminModel }  = require("../db");


adminRouter.post("/signup",async function(req,res){
    // schema of zod
    const requiredbody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(5).max(30)
    })
    // input for signup
    const email = req.body.email;
    const password = req.body.password;

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
    await UdataModel.create({
        email: email,
        password: hashedPassword
    });
    const allUsers = await UdataModel.find();
    console.log("All Users in Database:", allUsers);
    return sendResponse(res,200,"You are Signed up");
    } catch(e) {
        return sendResponse(res,500,"User already Exists");
        
    } 
     
});

adminRouter.post("/login", async function(req,res){
    const email = req.body.email;
    const password = req.body.password;

    try{
    const user = await UdataModel.findOne({
        email:email
    })
    if(!user) {
        res.json({
            message: "user does not exist"
        })
    }

    const passwordMatch = await bcrypt.compare(password , user.password);
    if(passwordMatch) {
        const token = jwt.sign({
            id : user._id.toString()
        }, JWT_SECRET);
        res.json({
            token:token
        });
    } else{
        res.status(403).json({
            message: "Incorrect Credentials"
        })
    }
    } catch(e) {
        res.status(500).json({
            message : "Failed to create token"
        });
    }


});


adminRouter.post("/" , function(req,res){
    res.json({
        message: "courses"
    })
});

adminRouter.put("/course" , function(req,res){
    res.json({
        message: "courses"
    })
});

adminRouter.get("/course-bulk" , function(req,res){
    res.json({
        message: "courses"
    })
});


module.exports = {
    adminRouter : adminRouter
}