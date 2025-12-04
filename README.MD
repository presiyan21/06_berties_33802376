# Bertie’s Books

A simple Node.js web application for managing a bookshop’s inventory. This project demonstrates how to build a dynamic web app using **Express**, **EJS**, and **MySQL**.  
Users can view all books, search for titles, add new books, and see bargain books priced under £20.  

---

## Technologies Used

- **HTML / EJS** – for structuring and templating web pages (`.ejs` files in the `views` folder)  
- **CSS** – for styling the pages (`main.css` in the `public` folder)  
- **Node.js** – runtime environment for the application (`index.js`)  
- **Express** – web framework used to handle routes and serve pages  
- **MySQL** – relational database for storing books and user data  
- **mysql2** – Node.js library used to connect Express with MySQL  
- **path** – built-in Node module to handle file paths
- **bcrypt** – used for hashing user passwords securely.
- **dotenv** – used to secure database credentials outside of source code.

---

## Main Features

- View all books in a clean, formatted list  
- Add new books to the database through a form  
- Search for books (exact or partial match)  
- Display bargain books priced below £20  
- Register new users (with hashed passwords)
- Secure User Login** and Audit Logging
- Dynamic templates rendered with EJS  

---

### Dotenv 
To keep sensitive database settings out of the source code, the app now uses the **dotenv** module.  
It’s loaded at the top of `index.js`, and all connection details were moved into a `.env` file.  
The app now reads these values using `process.env` instead of hardcoded credentials.

---

### Audit Logging 
A login audit system was added to record both successful and failed login attempts.  
A new `audit_log` table stores each attempt with the username, result, and timestamp.  
A helper function in `routes/users.js` writes entries to the table, and the login route logs an attempt after every authentication check.  
A new `/users/audit` route was added to display the full login history, with the most recent entries first.

## Routes

### 🔒 Protected Routes (require login)
- `/users/list` — user list is private  
- `/users/audit` — sensitive login information  
- `/books/addbook` — only logged-in users can add books  
- `/books/bookadded` — form submission for adding books  
- `/logout` — only appears when logged in  

### 🌐 Public Routes
- Homepage, About page  
- Login and Register pages  
- Book list, bargain books, search pages  

### 🧹 Input Sanitisation
To prevent XSS attacks, certain fields are sanitised using `express-sanitizer`:

**Sanitised fields:**  
- User registration: `first name`, `last name`, `username`, `email`  
- Book management: `book name`  

**Not sanitised:**  
- Passwords (stored hashed)  
- Book price (numeric)  
- Search keywords  

**Example:**  
Entering `<script>alert("XSS")</script>` in a sanitised field will be removed or escaped so it doesn’t run in the browser or get saved unsafely.

## API - Berties Books

### GET /api/books
Returns a JSON list of books.

Query parameters:
- `search` — substring search on the book `name`. Example: `?search=world`
- `minprice` — minimum price (inclusive). Example: `?minprice=5`
- `maxprice` — maximum price (inclusive). Example: `?maxprice=10`
- `sort` — sort by `name` or `price`. Example: `?sort=name`

Examples:
- `GET /api/books` — returns all books
- `GET /api/books?search=history&minprice=2&maxprice=12&sort=price` — filtered and sorted result

Response:
- `200 OK` — JSON array of book objects: `[ { "id": 1, "name": "...", "price": 9.99 }, ... ]`
- `500` on server/database error (body includes an `error` message)

## How to Install and Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/presiyan21/06_berties_33802376
## Installation and Setup

### 2. Install dependencies
```bash
npm install
```

### 3. Run the server

Start the application by running:

```bash
node index.js
```

### 4. Open your browser

Visit the following URL to view the app:

[http://localhost:8000](http://localhost:8000)

