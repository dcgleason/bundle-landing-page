// pages/api/getPeople.js

import { google } from 'googleapis';

export default async function handler(req, res) {
  console.log('Request headers:', req.headers); // Log the request headers to help debug
  try {
    const tokens = JSON.parse(req.headers.authorization.replace('Bearer ', ''));
    console.log('Tokens:', tokens); // Log the tokens

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);

    const people = google.people({ version: 'v1', auth: oauth2Client });

    const connections = await people.people.connections.list({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });

    console.log('Connections:', connections); // Log the connections

    res.json(connections.data.connections);

  } catch (error) {
    console.error('Failed to initialize Google API client:', error); // Log the error message
    res.status(500).json({ error: 'Failed to initialize Google API client', message: error.message }); // Include the error message in the response
  }
  
}
