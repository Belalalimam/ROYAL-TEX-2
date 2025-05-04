const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Users } = require("../models/users.moduls");
const crypto = require("crypto");

module.exports = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    try {
      const user = await Users.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          console.log(profile);

          // Find user using async/await
          let user = await Users.findOne({ googleId: profile.id });

          if (user) {
            const updatedUser = {
              fullname: profile.displayName,
              email: profile.emails[0].value,
              pic: profile.photos[0].value,
              secret: accessToken,
            };

            // Update user using async/await
            const result = await Users.findOneAndUpdate(
              { _id: user.id },
              { $set: updatedUser },
              { new: true }
            );

            return cb(null, result);
          } else {
            // Generate a random password for Google users
            const randomPassword = crypto.randomBytes(16).toString('hex');
            
            const newUser = new Users({
              googleId: profile.id,
              fullname: profile.displayName,  // Changed from username to fullname
              email: profile.emails[0].value,
              password: randomPassword,  // Added password field
              pic: profile.photos[0].value,
              secret: accessToken,
              isAccountVerified: true  // Set this to true for Google users
            });

            // Save user using async/await
            const result = await newUser.save();
            return cb(null, result);
          }
        } catch (err) {
          console.error("Google auth error:", err);
          return cb(err, null);
        }
      }
    )
  );
};
