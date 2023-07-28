const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
// const { Strategy: FacebookStrategy } = require('passport-facebook');
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
                passReqToCallback: true,
            },
            async (req, accessToken, refreshToken, profile, done) => {
                try {
                    return done(null, profile);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // passport.use(
    //     new FacebookStrategy(
    //         {
    //             clientID: process.env.FACEBOOK_OAUTH_CLIENT_ID || '',
    //             clientSecret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET || '',
    //             callbackURL: `${BASE_URL}/v1/oauth2/redirect/facebook`,
    //         },
    //         async (accessToken, refreshToken, profile, done) => {
    //             try {
    //                 return done(null, user);
    //             } catch (error) {
    //                 return done(error);
    //             }
    //         }
    //     )
    // );
}

module.exports = setupPassport;