import express from 'express'
const router = express.Router()
import passport from '../config/passport.js'

router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["https://www.googleapis.com/auth/plus.login", "email"],
    })
  );
  
  /* Callback route for OAuth2 authentication */
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
      // Successful authentication
      console.log(req.user);
      req.session.save(() => {
        res.redirect('http://localhost:5173/auth/callback');  // Edit for correct redirect link
      });
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