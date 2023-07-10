// pages/api/getPeople.js

import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const tokens = JSON.parse(req.headers.authorization.replace('Bearer ', ''));

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);

    const people = google.people({ version: 'v1', auth: oauth2Client });
    const connections = await people.people.connections.list({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });

    res.json(connections.data.connections);
  } catch (error) {
    console.error('Failed to list connections:', error);
    res.status(500).json({ error: 'Failed to list connections' });
  }
}
