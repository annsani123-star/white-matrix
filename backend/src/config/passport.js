const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// 🔹 GOOGLE OAUTH (PRIMARY LOGIN)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_, __, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("Google account has no email"), null);
        }

        // Find existing user by Google ID OR email
        let user = await User.findOne({
          $or: [
            { "google.id": profile.id },
            { "google.email": email },
          ],
        });

        if (!user) {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: email,
            google: {
              id: profile.id,
              email,
            },
          });
        } else {
          // Ensure Google account is linked
          user.google = {
            id: profile.id,
            email,
          };
          // Update main email if not set
          if (!user.email) {
            user.email = email;
          }
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
