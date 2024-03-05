const express = require("express");
const authrouter = require("../controller/authentication");
const dartarouter = require("../controller/darta.js");
const paymentRouter = require("../controller/payment.js");
const walletRouter = require("../controller/wallet.js");
const tokenRouter = require("../controller/token.js");
const stripeRouter = require("../controller/stripe.js");


const router = express.Router();

router.route("/login").post(authrouter.Login);
router.route("/register").post(authrouter.Registration);
router.route("/darta").post(dartarouter.Darta);
router.route("/getdarta").get(dartarouter.getAllDarta);
router.route("/getDartaById/:id").get(dartarouter.getDartaById);

//register functions and recently added things
router.route("/register-darta").post(dartarouter.registrationDarta);
router.route("/verify-darta").post(dartarouter.verifyDarta);
router.route("/get-accepted-darta").get(dartarouter.getDartaDetails);
router
  .route("/get-user-darta-message")
  .post(dartarouter.getAcceptRejectMessage);
router.route("/getDartaByEmail/:email").get(dartarouter.getDartaByEmail);
router.route("/getUnverifiedDarta").get(dartarouter.getUnverifiedData);
router.route("/putDartaVerify").put(dartarouter.putVerifyDarta);
router.route("/putDiscardVerify").put(dartarouter.putDiscardVerify);

//wallet
router.route("/add-wallet").post(walletRouter.addNewUser);
router.route("/isWalletExist").put(walletRouter.isWalletUserExist);

//payment
router.route("/add-payment").post(paymentRouter.addPayment);
router.route("/get-payment/:emailId").get(paymentRouter.getPaymentByWalletId);

//token
router.route("/validateToken").post(tokenRouter.validateToken);


//Report
router.route("/downloadVerifiedDarta/:isVerify").get(dartarouter.downloadVerifiedDarta);

// stripe
router.route("/postPaymentIntent").post(stripeRouter.postPaymentIntent);


module.exports = router;
