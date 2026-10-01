// Vercel serverless entry point.
// Environment variables are injected by Vercel — no dotenv needed.
// The lazy MongoDB middleware in app.js handles the DB connection.
const app = require('./app');
module.exports = app;
