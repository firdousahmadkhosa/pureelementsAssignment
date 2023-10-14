const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;


//__ Routes __ //
const siteRoutes = require("./routes/index");


app.use(bodyParser.json());


app.use("/api/v1", siteRoutes);


app.use((req, res, next) => {
  return res.status(404).send({
    message: "Resource not found",
  });
  next();
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
