# OWASP Security Methodologies Demo

A Node.js and Express-based web application developed as part of **SAD Lab (ITL703) — Experiment No. 4** to study and implement five OWASP security methodologies in a controlled local environment.

---

## Experiment Details

| Detail | Information |
|---|---|
| Experiment No. | 4 |
| Course | SAD Lab (ITL703) |
| Learning Outcome | LO2 — Understand OWASP methodologies and standards |
| Aim | To study and implement at least any 5 methodologies of OWASP |
| Technology | Node.js and Express.js |
| Application Type | Local Web Application |
| Purpose | Educational Security Demonstration |

---

## Aim

To study and implement at least five methodologies of OWASP.

---

## Learning Outcome

**LO2:** Student will be able to understand the OWASP methodologies and standards.

---

## Introduction

**OWASP (Open Worldwide Application Security Project)** is a non-profit organization and open community that focuses on improving the security of software and web applications.

OWASP provides freely available:

- Security standards
- Guidelines
- Tools
- Documentation
- Educational resources

One of the most widely used OWASP resources is the **OWASP Top 10**, which identifies critical security risks faced by web applications.

For this experiment, five OWASP methodologies were selected and implemented in a controlled local web application using **Node.js and Express.js**.

---

## OWASP Top 10

The OWASP Top 10 categories considered for this experiment are:

| No. | Category |
|---|---|
| A01 | Broken Access Control |
| A02 | Security Misconfiguration |
| A03 | Software Supply Chain Failures |
| A04 | Cryptographic Failures |
| A05 | Injection |
| A06 | Insecure Design |
| A07 | Authentication Failures |
| A08 | Software or Data Integrity Failures |
| A09 | Security Logging & Alerting Failures |
| A10 | Mishandling of Exceptional Conditions |

### Methodologies Implemented

This project implements the following five methodologies:

1. Broken Access Control
2. Security Misconfiguration
3. Cryptographic Failures
4. Authentication Failures
5. Security Logging & Alerting Failures

---

## Objectives

The objectives of this experiment are:

- To understand the purpose of OWASP and the OWASP Top 10.
- To study common security risks in web applications.
- To understand secure coding practices.
- To implement security controls for five selected OWASP categories.
- To test the effectiveness of the implemented security controls.

---

## Technologies Used

| Technology / Package | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Web application framework |
| Express Session | Session management |
| Helmet | Security-related HTTP headers |
| Bcrypt | Password hashing |
| Express Rate Limit | Limiting repeated login attempts |
| JavaScript | Application logic |
| HTML | User interface |
| Git | Version control |
| GitHub | Repository hosting |

---

## Project Structure

```text
OWASP-Demo/
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### File Description

| File | Description |
| --- | --- |
| `app.js` | Main Node.js/Express application |
| `package.json` | Project metadata and dependencies |
| `package-lock.json` | Records exact dependency versions |
| `.gitignore` | Prevents unnecessary files from being uploaded |
| `README.md` | Project documentation |

---

## Demo Accounts

### Normal User

```text
Username: priyanka
Password: priyanka123
Role: user
User ID: 1
```

### Administrator

```text
Username: admin
Password: admin123
Role: admin
User ID: 2
```

> **Note:** These credentials are created only for this educational demonstration and should not be used for real applications.

---

## 1. Broken Access Control

### Description

Broken Access Control occurs when an application does not correctly enforce restrictions on the resources or operations that a user is permitted to access. 

Authentication identifies a user, whereas authorization determines what that user is allowed to do. For example, a normal user should be able to view their own profile but should not be allowed to access another user's profile or an administrator's resources.

### Prevention

Access control should always be enforced on the server side. The application should verify:

- User identity
- User role
- Resource ownership
- Authorization permissions

before allowing access to protected resources.

### Implementation

The application verifies whether the logged-in user's ID matches the requested profile ID.

```javascript
if (req.session.userId != req.params.id) {
    return res.status(403).send("Access Denied");
}
```

If a user attempts to access another user's profile, the application returns:

```text
403 Access Denied
```

### Testing

Login using:

```text
Username: priyanka
Password: priyanka123
```

The user can access their own profile at `/profile/1`. An attempt to access the administrator's profile at `/profile/2` is rejected.

#### Expected Result

```text
Access Denied
```

---

## 2. Security Misconfiguration

### Description

Security Misconfiguration occurs when an application, server, framework, database, or other component is configured insecurely. Examples include:

- Default configurations
- Unnecessary services
- Enabled debugging features
- Improper permissions
- Missing security headers
- Improper error handling

### Prevention

Security misconfiguration can be reduced by:

- Using secure default configurations
- Disabling unnecessary services
- Removing debugging features from production environments
- Applying security updates
- Configuring appropriate security headers
- Avoiding detailed technical errors being displayed to users

### Implementation Using Helmet

The application uses the **Helmet** package to add security-related HTTP response headers.

```javascript
app.use(helmet());
```

Security headers can be inspected using the browser's Developer Tools.

### Secure Error Handling

The application also uses secure error handling. Instead of exposing technical details and stack traces to users, the application records the technical error on the server and displays a general message.

```javascript
res.status(500).send("Internal Server Error");
```

### Testing

Open the browser Developer Tools:

```text
Developer Tools → Network → Application Request → Headers → Response Headers
```

Security-related response headers generated by Helmet can be observed.

---

## 3. Cryptographic Failures

### Description

Cryptographic Failures occur when sensitive information is not adequately protected using appropriate cryptographic techniques. Sensitive information may include:

- Passwords
- Authentication credentials
- Personal information
- Confidential data

One common example is storing passwords in plain text. If an attacker obtains plaintext passwords, they can directly read and misuse them.

### Prevention

Passwords should never be stored in plaintext. A suitable password-hashing algorithm should be used to protect authentication information.

### Implementation Using Bcrypt

The application uses the **bcrypt** library to hash passwords before storing them.

```javascript
password: bcrypt.hashSync("priyanka123", 10)
```

During login, the entered password is compared with the stored hash.

```javascript
bcrypt.compare(password, user.password)
```

The original password is therefore not stored directly.

### Example

- **Original password:** `priyanka123`
- **Stored value:** `$2b$10$................................................`

The stored value is a bcrypt hash rather than the original password.

### Testing

The generated bcrypt hash can be observed in the terminal during the demonstration. The output confirms that the application does not directly store the original password.

---

## 4. Authentication Failures

### Description

Authentication is the process of verifying the identity of a user. Authentication failures occur when mechanisms used to verify a user's identity are implemented incorrectly or insufficiently. Examples include:

- Weak passwords
- Unlimited login attempts
- Poor session management
- Hard-coded credentials
- Improper authentication checks

### Prevention

Authentication security can be improved by:

- Using strong passwords
- Securely hashing passwords
- Implementing rate limiting
- Restricting repeated login attempts
- Managing sessions securely

### Implementation Using Rate Limiting

The application uses the `express-rate-limit` package to restrict repeated login requests.

```javascript
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5
});
```

This restricts repeated login requests and helps reduce automated password-guessing attempts.

### Testing

Incorrect credentials are entered repeatedly. After the configured number of attempts, the application temporarily restricts further login attempts.

**Expected response:**

```text
Too many login attempts. Please try again later.
```

---

## 5. Security Logging and Alerting Failures

### Description

Security Logging and Alerting Failures occur when important security-related events are not properly recorded, monitored, or reported. Security logs help administrators:

- Identify suspicious behaviour
- Investigate security incidents
- Understand how an attack occurred
- Monitor authentication activity
- Review unauthorized access attempts

### Important Events Recorded

The application records events such as:

```text
Successful Login
Failed Login
Unauthorized Access
Logout
```

### Implementation

A security logging function is implemented in the application.

```javascript
function addLog(event, username, details) {
    securityLogs.push({
        time: new Date().toLocaleString(),
        event,
        username,
        details
    });
}
```

For example, an unauthorized access attempt is recorded using:

```javascript
addLog(
    "UNAUTHORIZED ACCESS",
    req.session.username,
    `Attempted to access profile ${req.params.id}`
);
```

Successful and failed login attempts are also recorded.

### Security Logs Page

The administrator can access the security logs page at `/logs`. The page displays recorded security events such as `SUCCESSFUL LOGIN`, `FAILED LOGIN`, `UNAUTHORIZED ACCESS`, and `LOGOUT`. This allows important security-related activities to be recorded and reviewed.

---

## Working of the Application

The application provides a simple login system containing two types of users:

```text
Normal User: priyanka / priyanka123
Administrator: admin / admin123
```

When a user enters their username and password, the application verifies the credentials. The entered password is compared with the stored bcrypt hash. If the credentials are correct, a session is created for the user.

After authentication, the application checks the user's permissions before allowing access to protected resources. A normal user can access only authorized resources, while administrative resources are restricted to the administrator. 

The application also limits repeated login attempts to reduce authentication attacks. Successful and failed login attempts are recorded in the security logs, alongside unauthorized access attempts. In case of an internal server error, technical details are recorded on the server while only a general error message is displayed to the user.

---

## Application Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Login page | Public |
| `/login` | User authentication | Public |
| `/dashboard` | User dashboard | Logged-in users |
| `/profile/:id` | User profile | Authorized user |
| `/admin` | Administrator dashboard | Admin only |
| `/logs` | Security logs | Admin only |
| `/logout` | Logout | Logged-in users |

---

## Security Controls Summary

| OWASP Methodology | Security Control | Demonstration |
| --- | --- | --- |
| Broken Access Control | Server-side authorization checks | Unauthorized profile access returns 403 |
| Security Misconfiguration | Helmet and secure error handling | Security headers and generic errors |
| Cryptographic Failures | Bcrypt password hashing | Password stored as hash |
| Authentication Failures | Login rate limiting | Repeated login attempts restricted |
| Security Logging & Alerting Failures | Security event logging | Administrator can review events |

---

## Testing Summary

The implemented security controls were tested using the local web application.

- **Test 1 — Normal User Access:** Logged in as `priyanka` / `priyanka123`. The normal user can access their own resources.
- **Test 2 — Unauthorized Resource Access:** While logged in as Priyanka, access `/profile/2`. Expected result: `403 Access Denied`.
- **Test 3 — Security Headers:** Helmet-generated security headers can be viewed through Developer Tools → Network → Headers.
- **Test 4 — Password Hashing:** The password is stored as a bcrypt hash rather than plaintext.
- **Test 5 — Repeated Login Attempts:** Multiple failed login attempts eventually trigger the configured rate limiter.
- **Test 6 — Security Logging:** The administrator can review successful logins, failed logins, unauthorized access attempts, and logout events.

---

## Advantages

1. OWASP helps identify common web application security risks.
2. It promotes secure coding and application development practices.
3. It helps protect sensitive user and application data.
4. It improves authentication, authorization, and security monitoring.
5. It provides widely accepted security guidelines for developers.
6. Security controls can be incorporated during application development.
7. Security events can be recorded and reviewed for investigation.

---

## Limitations

1. OWASP Top 10 does not cover every possible security vulnerability.
2. Implementing OWASP guidelines alone does not guarantee complete application security.
3. Additional security testing such as SAST, DAST, and penetration testing may be required.
4. Security requirements may vary depending on the application and its environment.
5. This project is a controlled educational demonstration and is not a production-ready security system.

---

## Installation and Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

Verify installations:

```bash
node --version
npm --version
```

### Clone the Repository

```bash
git clone https://github.com/raoopriyanka/OWASP-Demo.git
cd OWASP-Demo
```

### Install Dependencies

```bash
npm install
```

### Run the Application

```bash
node app.js
```

The application will run at `http://localhost:3000`. Open this address in a web browser to access the application.

---

## Git and GitHub

Git is used for version control and tracking changes to the project. GitHub is used to host the project repository and provide access to the source code.

Typical commands used for this project include:

```bash
git init
git status
git add .
git commit -m "Implement OWASP security methodologies"
git branch -M main
git remote add origin <repository-url>
git push -u origin main
```

---

## Learning Outcome Summary

This experiment demonstrates the application of OWASP security methodologies in a web application. The implementation provides practical understanding of:

- Authentication
- Authorization
- Password hashing
- Rate limiting
- Security headers
- Error handling
- Security logging
- Access control

The experiment demonstrates how security controls can be incorporated into application development to reduce common web application security risks.

---

## Conclusion

This experiment demonstrated the importance of OWASP methodologies in developing secure web applications. Five OWASP security methodologies were implemented in a local Node.js and Express application:

1. **Broken Access Control**
2. **Security Misconfiguration**
3. **Cryptographic Failures**
4. **Authentication Failures**
5. **Security Logging & Alerting Failures**

The implementation demonstrated how vulnerabilities related to unauthorized access, insecure configuration, improper password protection, repeated authentication attempts, and insufficient security logging can be reduced by applying appropriate security practices. Therefore, studying and implementing OWASP methodologies helps developers identify common security risks and apply secure coding techniques to build safer and more reliable web applications.

---

## Disclaimer

This project is developed strictly for **educational and laboratory purposes** as part of SAD Lab. The application is a controlled demonstration of OWASP security methodologies and should not be considered a production-ready security implementation. The demo credentials included in this repository are intended only for testing the application locally.

---

## Author

**Priyanka**  
**B.Tech — Information Technology**
