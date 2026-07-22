import { OAuth2Client } from "google-auth-library";

/**
 * Service to verify Google Identity Services (GIS) ID Tokens.
 */
export async function verifyGoogleIdToken(credential) {
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId || clientId.trim() === "" || clientId.includes("YOUR_GOOGLE_CLIENT_ID")) {
    throw new Error("GOOGLE_CLIENT_ID_NOT_CONFIGURED");
  }

  const client = new OAuth2Client(clientId);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: clientId
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error("Invalid Google ID Token payload");
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
    profilePhoto: payload.picture || ""
  };
}
