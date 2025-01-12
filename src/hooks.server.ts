// src/hooks.server.ts
import { sessionHooks, type Handler } from "@kinde-oss/kinde-auth-sveltekit";
import jwt from 'jsonwebtoken';

import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: 'https://kuhnelo.kinde.com/.well-known/jwks.json'
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid, function(err, key) {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    });
  }
  

export const handle: Handler = async ({ event, resolve }) => {
  sessionHooks({ event });

  const token = event.request.headers.get('Authorization')?.split(' ')[1];
  if (token) {
    jwt.verify(token, getKey, {}, (err, decoded) => {
      if (err) {
        
      } else {
        
      }
    });
  }

  const response = await resolve(event);
  return response;
};