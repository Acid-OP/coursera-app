require('dotenv').config()
const express = require("express");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/admin", adminRouter);


async function main () {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
    console.log("db")

}
main()




/*


const jwt = require("jsonwebtoken");
const JWT_SECRET = "gaurav123";


app.use(express.json());
const bcrypt = require("bcrypt");
const {z} = require("zod");


app.post("/user/purchase-course", auth , async function(req,res){
    try {
        const userId = req.userId; 
        const courses = await AllCoursesModel.find(); 
        console.log("Courses fetched:", courses);
        res.status(200).json(courses);
      } catch (err) {
        res.status(500).json({ message: "Error fetching courses" });
      }
})


function auth(req,res,next) {
    const token = req.headers.token;

    const decodeData = jwt.verify(token , JWT_SECRET);

    if(decodeData){
        req.userId = decodeData.id;
        next();
    } else {
        res.status(403).json({
            message : "Incorrect Token"
        })
    }
}

app.post("/user/see-course" , auth , async function(req,res){
    const userId = req.userId;
    const Courseid = req.body.purchasedcourseid;
    try{
    const course =  await AllCoursesModel.findById(Courseid);
    console.log("Courses fetched from DB:", courses); // Debug log

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
      }

    const existingPurchase = await PurchasedCoursesModel.findOne({ userId, Courseid });
        if (existingPurchase) {
            return res.status(400).json({ message: "Course already purchased" });
      }
    const purchase = await PurchasedCoursesModel.create({
        userId: userId.toString(), 
        Courseid: Courseid.toString(),
        courseName: course.courseName 
        
    });

    const populatedPurchase = await PurchasedCoursesModel.findById(purchase._id)
        .populate("userId")  
        .populate("Courseid");  

        return res.json({
        message: "Course purchased successfully",
        data: populatedPurchase,
    });
  } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
  }

});

*/