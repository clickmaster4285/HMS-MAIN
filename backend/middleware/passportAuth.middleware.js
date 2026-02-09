// config/passport.js
require("dotenv").config();
const passport = require("passport");
const hospitalModel = require("../models/index.model");
const { ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;

const JWT_SECRET = process.env.JWT_SECRET;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Find the user in database using the ID from JWT payload
      const user = await hospitalModel.User.findById(jwt_payload.id || jwt_payload._id);

      if (user) {
        return done(null, user); // Authentication successful with user object
      } else {
        return done(null, false, { message: "User not found" }); // User not found
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      return done(error, false, { message: "Error during authentication" }); // General error
    }
  })
);

module.exports = passport;