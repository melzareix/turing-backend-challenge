/**
 * Passport JWT Parsing & Extraction.
 */

import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import FacebookTokenStrategy from 'passport-facebook-token';
import customers from '../customers';

require('dotenv').config();

const parseHeader = hdrValue => {
  const re = /(\S+)\s+(\S+)/;
  if (typeof hdrValue !== 'string') {
    return null;
  }
  const matches = hdrValue.match(re);
  return matches && { scheme: matches[1], value: matches[2] };
};

const extractTokenFromUserKeyHeader = request => {
  let token = null;
  const hdr = request.headers['user-key'];
  if (hdr) {
    const authParams = parseHeader(hdr);
    if (authParams && authParams.scheme.toLowerCase() === 'bearer') {
      token = authParams.value;
    }
  }
  return token;
};

export const jwtStrategy = new Strategy(
  {
    secretOrKey: process.env.JWT_KEY,
    jwtFromRequest: ExtractJwt.fromExtractors([extractTokenFromUserKeyHeader])
  },
  async (payload, done) => {
    const user = await customers.Customers.findWithId(payload.id);
    return done(null, user);
  }
);

/*
  Facebook Auth.
*/

export const facebookStrategy = new FacebookTokenStrategy(
  {
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET
  },
  (accessToken, refreshToken, profile, done) => {
    done(null, {
      accessToken,
      refreshToken,
      profile
    });
  }
);

export const authenticateFacebook = (req, res) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      'facebook-token',
      { session: false },
      (err, data, info) => {
        if (err) reject(err);
        resolve({ data, info });
      }
    )(req, res);
  });
