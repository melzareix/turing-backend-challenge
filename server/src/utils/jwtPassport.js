/**
 * Passport JWT Parsing & Extraction.
 */

import { Strategy, ExtractJwt } from 'passport-jwt';
import customers from '../customers';

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

export default new Strategy(
  {
    secretOrKey: process.env.JWT_KEY,
    jwtFromRequest: ExtractJwt.fromExtractors([extractTokenFromUserKeyHeader])
  },
  async (payload, done) => {
    const user = await customers.Customers.findWithId(payload.id);
    return done(null, user);
  }
);
