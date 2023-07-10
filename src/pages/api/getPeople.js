// pages/api/getPeople.js

import { google } from 'googleapis';
import cookie from 'cookie';

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const tokens = JSON.parse(cookies.auth);

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);

  const people = google.people({ version: 'v1', auth: oauth2Client });
  const connections = await people.people.connections.list({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses',
  });

  res.json(connections.data.connections);
}
