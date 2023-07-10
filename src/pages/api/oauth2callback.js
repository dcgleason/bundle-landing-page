// pages/api/oauth2callback.js

import { google } from 'googleapis';
import cookie from 'cookie';
import fetch from 'node-fetch'; // You might need to install this with npm

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    res.status(400).send('Missing authorization code');
    return;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET,
    'https://www.givebundl.com/api/oauth2callback'
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('refresh token' + tokens.refresh_token)
    oauth2Client.setCredentials(tokens);

    // Set the tokens in a cookie
    res.setHeader('Set-Cookie', cookie.serialize('auth', JSON.stringify(tokens), {
        httpOnly: false,
        secure: true, // Use HTTPS in production
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax', // Changed from 'strict' to 'lax'
        path: '/',
      }));

    // Get the user's profile
    const people = google.people({ version: 'v1', auth: oauth2Client });
    const me = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names',
    });

    // Get the user's email address
    const userGoogleId = me.data.resourceName;
    console.log('userGoogleId' + userGoogleId)
    const userGoogleEmail = me.data.emailAddresses && me.data.emailAddresses.length && me.data.emailAddresses[0].value;
    console.log('userGoogleEmail' + userGoogleEmail)



    res.redirect('https://www.givebundl.com/bundl_details'); // Redirect the user back to your site
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`Error: ${error.message}`);

  }
}