const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
require('dotenv').config();

const UserModel = require('../models/user.model');
const BASE_URL = process.env.BASE_URL || 'https://localhost:3000';

const setupPassport = () => {
    passport.use(
        new JwtStrategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
            },
            async (jwtPayload, done) => {
                try {
                    const user = await UserModel.findById(jwtPayload.id);
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
                clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
                callbackURL: `${BASE_URL}/v1/auth/google/callback`,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await UserModel.findOne({ googleId: profile.id });
                    if (user) {
                        return done(null, user);
                    }
                    const newUser = {
                        googleId: profile.id,
                        name: profile.displayName,
                        isConfirmed: profile._json.email_verified,
                        email: profile._json.email,
                        avatar: profile._json.picture,
                        lastLogin: new Date()
                    };
                    user = await UserModel.create(newUser);
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
}

module.exports = setupPassport;