const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Security + cross-origin settings
app.use(helmet());
app.use(cors());

// Test homepage
app.get("/", (req, res) => {
  res.send("Converter is running");
});

// Route setup
require("./routes/api.js")(app);

// 404 (wrong address)
app.use((req, res) => res.status(404).send("Not Found"));

app.listen(3000, () => console.log("Running on port 3000"));

module.exports = app;
