const express = require("express");
const router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const authController = require("../controllers/auth.controller");

const clientGoogle = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/", async (req, res) => {
  const { token } = req.body;

  try {
    const verify = await clientGoogle.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = verify.getPayload();
    return res.status(200).json({ email, name, picture });
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    return res
      .status(401)
      .json({ message: "Google ID token verification failed" });
  }
});

router.post(
  "/login",
  validators.validate([
    body("email")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false })
      .exists(),
  ]),
  authController.loginWithGoogle
);

router.post(
  "/loginGooglePhimGiaLai",
  validators.validate([
    body("email")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false })
      .exists(),
  ]),
  authController.loginWithGooglePhimGiaLai
);

module.exports = router;
