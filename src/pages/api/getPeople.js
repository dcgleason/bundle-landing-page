// pages/api/getPeople.js

import { google } from 'googleapis';

export default async function handler(req, res) {
  const tokens = JSON.parse(req.headers.authorization.replace('Bearer ', ''));

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials(tokens);

  const people = google.people({ version: 'v1', auth: oauth2Client });
  const connections = await people.people.connections.list({
    resourceName: 'people/me',
    personFields: 'names,emailAddresses',
  });

  res.json(connections.data.connections);
}