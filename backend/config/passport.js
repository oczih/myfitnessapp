import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import FitnessUser from "../models/usermodel.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

/* Passport Middleware */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await FitnessUser.findOne({ googleId: profile.id });

        if (!user) {
          user = await FitnessUser.create({
            googleId: profile.id,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails[0].value,
          });
        }
        const token = jwt.sign(
        { id: user._id }, 
        process.env.SECRET, 
        { expiresIn: '7d' }
      );
        return done(null, {user, token});
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

/* Store user ID in session */
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/* Retrieve full user object by ID from session */
passport.deserializeUser(async (id, done) => {
  try {
    const user = await FitnessUser.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
