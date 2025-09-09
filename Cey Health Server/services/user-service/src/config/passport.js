import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// Google strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth client secret
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      //console.log("Google profile:", profile);
      // Check if user already exists in the database
      const email = profile._json?.email || profile.emails?.[0]?.value;
      const existingUser = await User.getUserByEmail(email);

      if (existingUser) {
        const user = {
          ...existingUser,
          googleLoginAttempt: true,
          existingUser: true,
        };

        return done(null, user);
      }

      // Setup user session object with known fields
      const newUser = {
        google_id: profile.id,
        email: email,
        first_name: profile.name?.givenName || profile.given_name,
        last_name: profile.name?.familyName || profile.family_name || "",
        hashedPassword: "google", // google as a password placeholder
        role: "patient",
        status: "active",
        birthday: profile._json?.birthday || null,
        street: null,
        city: null,
        postal_code: null,
        existingUser: false,
        googleLoginAttempt: true,
      };
      return done(null, newUser);
    }
  )
);

// Facebook strategy
passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID, // Facebook App ID
      clientSecret: process.env.FACEBOOK_APP_SECRET, // Facebook App Secret
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      passReqToCallback: true,
      profileFields: [
        "id",
        "emails",
        "name",
        "displayName",
        "birthday",
        "location",
      ],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("Facebook profile:", profile);

        // Extract email if available
        const email = profile.emails?.[0]?.value;

        // Search for existing user by email
        const existingUser = email ? await User.getUserByEmail(email) : null;

        if (existingUser) {
          const user = {
            ...existingUser,
            facebookLoginAttempt: true,
            existingUser: true,
          };

          return done(null, user);
        }

        // Construct new user object
        const newUser = {
          facebook_id: profile.id,
          email: email || null,
          first_name: profile.name?.givenName,
          last_name: profile.name?.familyName,
          hashedPassword: "facebook", // facebook as a password placeholder
          role: "patient",
          status: "active",
          birthday: profile._json?.birthday || null,
          city: profile._json?.location?.name || null,
          street: null,
          postal_code: null,
          existingUser: false,
          facebookLoginAttempt: true,
        };

        return done(null, newUser);
      } catch (error) {
        console.error("Facebook Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

//local strategy for username and password authentication
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Check password
        const storedHashedPassword = user.password_hash;
        const isMatch = await bcrypt.compare(password, storedHashedPassword);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (error) {
        console.error("Local Strategy Error:", error);
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
// This is used to store user information in the session
// and retrieve it later
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
