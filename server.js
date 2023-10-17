const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
var expressValidator = require("express-validator");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;


//__ Routes __ //
const siteRoutes = require("./routes/index");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "get", "post", "put"],
};
app.use(cors(corsOptions));

// express validater middelware
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
    customValidators: {
      isImage: function (value, filename) {
        const extension = path.extname(filename).toLowerCase();
        switch (extension) {
          case ".jpg":
            return ".jpg";
          case ".jpeg":
            return ".jpeg";
          case ".png":
            return ".png";
          case "":
            return ".jpg";
          default:
            return false;
        }
      },
      isUUID:function(value,uuid){
         const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
         const testValidUUID = uuidRegex.test(uuid);
         return testValidUUID;
      }
    },
  })
);



// database
const db = require("./models");
// const Role = db.role;
const User = db.user;

// force: true will drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Database with { force: true }");
  initial();
});






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

function initial() {
  //------ Inserting Dumy Admin Data ----
  User.create({
    username: "admin",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("Admin@gmail1", 8),
  });
}