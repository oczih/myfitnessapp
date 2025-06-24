import express from 'express'
const router = express.Router()
import passport from '../config/passport.js'
import dotenv from 'dotenv'
dotenv.config()
router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["https://www.googleapis.com/auth/plus.login", "email"],
    })
  );
  
  /* Callback route for OAuth2 authentication */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: '/' }),
  function (req, res) {
    const { user, token } = req.user;

    // Encode URI components for safety
    const redirectUrl = new URL(`${process.env.BACKEND_URL}/auth/callback`);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('name', user.name);
    redirectUrl.searchParams.set('email', user.email);
    redirectUrl.searchParams.set('id', user._id.toString());

    console.log('Redirecting to:', redirectUrl.toString());

    res.redirect(redirectUrl.toString());
  }
);
  

router.post('/signout', (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid')
        res.json({ message: 'Signed out' })
      })
    })
  })
  /* EXPORTS */
export default router