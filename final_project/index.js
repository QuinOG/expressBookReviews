const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  next();
});

// Login route handler
app.post("/customer/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ username: username }, 'secret_key');
    req.session.username = username; // Store username in session
    return res.status(200).json({ message: "Login successful!", token: token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
