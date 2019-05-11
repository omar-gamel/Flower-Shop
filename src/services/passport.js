const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../models/user');
const config = require('config');

module.exports = (passport) => {
    const params = {
        secretOrKey: config.get('jwtSecret'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };
    const strategy = new JwtStrategy(params, async (jwt_payload, done) => {
        try {
            const user = await User.findById({
                _id: jwt_payload._id
            });
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    });
    passport.use(strategy);
    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", { session: false });
        }
    };
};