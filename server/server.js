const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const admin = require("firebase-admin");
const serviceAccount = require("./service-account.json");

app.listen(port, () => console.log(`Listening on port ${port}`));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
