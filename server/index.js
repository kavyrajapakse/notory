const app = require('./app');

// Vercel serverless requires us to export the app
module.exports = app;

// If running locally (running "node index.js" directly), start the listener
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}