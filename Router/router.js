const express =require("express")
const authrouter=require("../controller/authentication")
const dartarouter=require("../controller/darta.js")

const router=express.Router()

router.route("/login").post(authrouter.Login);
router.route("/register").post(authrouter.Registration)
router.route("/darta").post(dartarouter.Darta)
router.route("/getdarta").get(dartarouter.getAllDarta);

//register functions and recently added things
router.route("/register-darta").post(dartarouter.registrationDarta);
router.route("/verify-darta").post(dartarouter.verifyDarta)
router.route("/get-accepted-darta").get(dartarouter.getDartaDetails)
router.route("/get-user-darta-message").post(dartarouter.getAcceptRejectMessage)


module.exports = router;