const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10; // Number of salt rounds for bcrypt

const mysql = require("mysql");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);



app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "hellothere",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set it to true if using HTTPS
      maxAge: 60 * 60 * 1000, // Session expiration time (in milliseconds)
      sameSite: "none", // Set it to "none" if using cross-site requests
      httpOnly: true, // Restrict cookie access to HTTP(S) only
    },
  })
);

app.use(cookieParser());
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "Mina@1218",
  database: "shopping",
});
// Hashes the password using bcrypt before storing in the database
const hashPassword = (password, callback) => {
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.log("Error occurred while hashing password:", err);
      callback(err, null);
    } else {
      callback(null, hash);
    }
  });
};

// Compares the provided password with the hashed password in the database
const comparePassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.log("Error occurred while comparing passwords:", err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

// API FOR website users database
app.get("/api/get", (req, res) => {
  const sqlGet = "SELECT * FROM register_users";
  db.query(sqlGet, (error, result) => {
    res.send(result);
    console.log(result);
  });
});

app.get("/login", (req, res) => {
  if (req.session.users) {
    res.send({ loggedIn: true, user: req.session.users });
  } else {
    res.send({ loggedIn: false });
  }
});

// API for login page
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sqlSelect = "SELECT * FROM register_users WHERE email = ?";
  db.query(sqlSelect, [email], (error, results) => {
    const JWT_SECRET = "helloIamVedant";
    const token = jwt.sign({ email: req.body.email }, JWT_SECRET);

    if (error) {
      console.log("Error occurred while fetching user data:", error);
      res.status(500).send("Internal Server Error");
    } else {
      if (results.length > 0) {
        const user = results[0];
        comparePassword(password, user.password, (err, passwordMatch) => {
          if (err) {
            res.status(500).send("Internal Server Error");
          } else {
            if (passwordMatch) {
              res
                .cookie("users", token, {
                  maxAge: 60 * 60 * 1000, // Session expiration time (in milliseconds)
                  secure: false, // Set it to true if using HTTPS
                  httpOnly: true, // Restrict cookie access to HTTP(S) only
                })
                .status(200)
                .json({ message: "Login successful", data: token });
              req.session.users = results;
              console.log(results);
            } else {
              res.status(401).json({ message: "Invalid email or password" });
            }
          }
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    }
  });
});

// API for registration page of website user
app.post("/api/post", (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  hashPassword(password, (err, hashedPassword) => {
    if (err) {
      res.status(500).send("Error occurred while hashing password");
    } else {
      hashPassword(confirm_password, (err, hashedConfirmPassword) => {
        if (err) {
          res.status(500).send("Error occurred while hashing confirm password");
        } else {
          const sqlInsert =
            "INSERT INTO register_users (name, email, password, confirm_password) VALUES (?, ?, ?, ?)";
          db.query(
            sqlInsert,
            [name, email, hashedPassword, hashedConfirmPassword],
            (error, result) => {
              if (error) {
                console.log("Error occurred while inserting data:", error);
                res.status(500).send("Error occurred while inserting data");
              } else {
                res.status(200).json({ message: "Registration successful" });
              }
            }
          );
        }
      });
    }
  });
});

//API for website user database page (HOME.JS)
app.delete("/api/remove/:email", (req, res) => {
  const { email } = req.params;
  const sqlRemove = "DELETE FROM register_users WHERE email = ?";
  db.query(sqlRemove, email, (error, result) => {
    if (error) {
      console.log("error");
      res.status(500).send("Error occurred while inserting data");
    } else {
      res.sendStatus(200); // Sending a success response
    }
  });
});

app.get("/api/get/:email", (req, res) => {
  const { email } = req.params;
  const sqlGet = "SELECT * FROM register_users WHERE email = ?";
  db.query(sqlGet, email, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

//API for add customer details page
// Retrieves customer details from the request body and inserts into the database

app.post("/api/customerDetails", (req, res) => {
  const { user_name, email, age, income, spending_score } = req.body;

  const sqlInsert =
    "INSERT INTO customer_details (user_name, email, age, income, spending_score) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sqlInsert,
    [user_name, email, age, income, spending_score],
    (error, result) => {
      if (error) {
        console.log("Error occurred while inserting data:", error);
        res
          .status(500)
          .json({ message: "Error occurred while inserting data" });
      } else {
        const customerId = result.insertId;
        res
          .status(200)
          .json({ message: "Customer details added successfully", customerId });
      }
    }
  );
});

// ... remaining server code ...

//API FOR customer_details database
// Retrieves all customer details from the database

app.get("/testing", (req, res) => {
  const sqlGet = "SELECT * FROM customer_details;";
  db.query(sqlGet, (error, result) => {
    if (error) {
      console.log("error");
    }
    res.send(result);
    console.log(result);
  });
});

//API for deleting items in customer_details database
// Deletes customer details based on the provided email

app.delete("/api/delete/:email", (req, res) => {
  const { email } = req.params;
  const sqlRemove = "DELETE FROM customer_details WHERE email = ?";
  db.query(sqlRemove, email, (error, result) => {
    if (error) {
      console.log("Error occurred while deleting data:", error);
      res.status(500).send("Error occurred while deleting data");
    } else {
      res.sendStatus(200); // Sending a success response
    }
  });
});

// Retrieves customer details based on the provided email
app.get("/api/get/:email", (req, res) => {
  const { email } = req.params;
  const sqlGet = "SELECT * FROM customer_details WHERE email = ?";
  db.query(sqlGet, email, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
