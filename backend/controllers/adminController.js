const Admin = require("../models/Admin")
const User=require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const myAdminKey = "admin@123"

const adminRegister = async (req, res) => {
    try {
        const adminAlreadyexists = await Admin.findOne({ email: req.body.email })

        if (adminAlreadyexists) {
            return res.status(400).json({ msg: "Admin already exists" })
        }

        const { name, email, password } = req.body//email: "admin@email.com",pwd: "admin@123"
        const hashedPassword = await bcrypt.hash(password, 10)
        const admin = new Admin({ name, email, password: hashedPassword })
        await admin.save()
        res.status(200).json({ success: true })
    } catch (error) {
        console.log(error);
    }
}

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.json({ success: false });
            }
            const adminToken = jwt.sign({ email: admin.email }, myAdminKey);
            res.status(200).json({ success: true, adminToken: adminToken });
            console.log("adminlogintoken", adminToken);
        } else {
            res.status(404).json({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const getUserData=async (req,res)=>{
    try {
        const userData=await User.find({})
        res.status(200).json({success:true,userData})
        console.log("userdata",userData);
    } catch (error) {
        console.log(error);
    }
}


module.exports = { 
    adminRegister, 
    adminLogin,
    getUserData
 }