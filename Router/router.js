const express =require("express")
const authrouter=require("../controller/authentication")
const dartarouter=require("../controller/darta.js")

const router=express.Router()

router.route("/login").post(authrouter.Login);
router.route("/register").post(authrouter.Registration)
router.route("/darta").post(dartarouter.Darta)
router.route("/getdarta").get(dartarouter.getAllDarta);
module.exports = router;