// src/config/amplify.js
import { Amplify } from "aws-amplify";

const region = import.meta.env.VITE_AWS_REGION;
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID;
const domain = import.meta.env.VITE_COGNITO_DOMAIN;

// Permite string o array en .env, pero Amplify v6 espera arrays
const rawRedirectSignIn =
  import.meta.env.VITE_COGNITO_REDIRECT_SIGNIN || window.location.origin + "/";
const rawRedirectSignOut =
  import.meta.env.VITE_COGNITO_REDIRECT_SIGNOUT || window.location.origin + "/";

const redirectSignIn = Array.isArray(rawRedirectSignIn) ? rawRedirectSignIn : [rawRedirectSignIn];
const redirectSignOut = Array.isArray(rawRedirectSignOut)
  ? rawRedirectSignOut
  : [rawRedirectSignOut];

// Validaciones mínimas para detectar problemas de config temprano
function assert(value, message) {
  if (!value || (Array.isArray(value) && value.some((v) => !v))) throw new Error(message);
}
assert(region, "VITE_AWS_REGION es requerido");
assert(userPoolId, "VITE_COGNITO_USER_POOL_ID es requerido");
assert(userPoolClientId, "VITE_COGNITO_USER_POOL_CLIENT_ID es requerido");
assert(domain, "VITE_COGNITO_DOMAIN es requerido");
assert(redirectSignIn.length > 0, "VITE_COGNITO_REDIRECT_SIGNIN es requerido");
assert(redirectSignOut.length > 0, "VITE_COGNITO_REDIRECT_SIGNOUT es requerido");

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        oauth: {
          domain, // ej: cdd-auth.auth.us-east-1.amazoncognito.com (sin https://)
          scopes: ["openid", "email", "profile"],
          redirectSignIn, // <-- arrays
          redirectSignOut, // <-- arrays
          responseType: "code", // PKCE
        },
      },
    },
  },
});
