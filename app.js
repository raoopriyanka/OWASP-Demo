const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcrypt");
const rateLimit = require("express-rate-limit");
const session = require("express-session");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Methodology 2: Security Misconfiguration
// Helmet adds security-related HTTP headers
app.use(helmet());

// Session configuration
app.use(
    session({
        secret: "sad-lab-secret-key",
        resave: false,
        saveUninitialized: false
    })
);

// Methodology 4: Authentication Failures
// Limit repeated login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login attempts. Please try again later."
});

// Demo users
const users = [
    {
        id: 1,
        username: "priyanka",
        password: bcrypt.hashSync("priyanka123", 10),
        role: "user"
    },
    {
        id: 2,
        username: "admin",
        password: bcrypt.hashSync("admin123", 10),
        role: "admin"
    }
];

// Methodology 5: Security Logging
const securityLogs = [];

function addLog(event, username, details) {
    securityLogs.push({
        time: new Date().toLocaleString(),
        event,
        username,
        details
    });
}

// Home page
app.get("/", (req, res) => {
    res.send(`
        <h1>OWASP Security Demo</h1>

        <h2>Login</h2>

        <form method="POST" action="/login">
            <input name="username" placeholder="Username" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>

        <h3>Demo Accounts</h3>

        <p><b>Normal User</b></p>
        <p>Username: priyanka</p>
        <p>Password: priyanka123</p>

        <p><b>Administrator</b></p>
        <p>Username: admin</p>
        <p>Password: admin123</p>
    `);
});
// Login
app.post("/login", loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);

    if (!user) {
        addLog("FAILED LOGIN", username, "Invalid username");
        return res.status(401).send("Invalid username or password");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        addLog("FAILED LOGIN", username, "Invalid password");
        return res.status(401).send("Invalid username or password");
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;

    addLog("SUCCESSFUL LOGIN", username, "User logged in successfully");

    res.redirect("/dashboard");
});

// Authentication middleware
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).send("Please login first");
    }

    next();
}

// Methodology 1: Broken Access Control
app.get("/profile/:id", requireLogin, (req, res) => {

    if (req.session.userId != req.params.id) {
        addLog(
            "UNAUTHORIZED ACCESS",
            req.session.username,
            `Attempted to access profile ${req.params.id}`
        );

        return res.status(403).send("Access Denied");
    }

    res.send(`
        <h1>Profile</h1>
        <p>User ID: ${req.params.id}</p>
        <p>Username: ${req.session.username}</p>
        <p>Role: ${req.session.role}</p>
    `);
});

// Dashboard
app.get("/dashboard", requireLogin, (req, res) => {
    res.send(`
        <h1>Dashboard</h1>
        <p>Welcome ${req.session.username}</p>
        <p>Role: ${req.session.role}</p>

        <p>
            <a href="/profile/${req.session.userId}">
                View My Profile
            </a>
        </p>

        <p>
            <a href="/admin">
                Admin Dashboard
            </a>
        </p>

        <p>
            <a href="/logs">
                Security Logs
            </a>
        </p>

        <p>
            <a href="/logout">
                Logout
            </a>
        </p>
    `);
});

// Admin authorization
app.get("/admin", requireLogin, (req, res) => {

    if (req.session.role !== "admin") {
        addLog(
            "UNAUTHORIZED ADMIN ACCESS",
            req.session.username,
            "Normal user attempted to access admin dashboard"
        );

        return res.status(403).send("Access Denied: Admins only");
    }

    res.send(`
        <h1>Admin Dashboard</h1>
        <p>Welcome Administrator.</p>
        <p>You have administrative privileges.</p>
    `);
});

// Methodology 5: Security Logging
app.get("/logs", requireLogin, (req, res) => {

    if (req.session.role !== "admin") {
        return res.status(403).send("Access Denied: Admins only");
    }

    let output = "<h1>Security Logs</h1>";

    securityLogs.forEach(log => {
        output += `
            <p>
                <b>${log.time}</b> -
                ${log.event} -
                ${log.username} -
                ${log.details}
            </p>
        `;
    });

    res.send(output);
});

// Logout
app.get("/logout", requireLogin, (req, res) => {

    const username = req.session.username;

    addLog("LOGOUT", username, "User logged out");

    req.session.destroy(() => {
        res.send("Logged out successfully. <a href='/'>Login again</a>");
    });
});

// Methodology 2: Secure error handling
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).send("Internal Server Error");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});