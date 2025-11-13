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

---

## Main Features

- View all books in a clean, formatted list  
- Add new books to the database through a form  
- Search for books (exact or partial match)  
- Display bargain books priced below £20  
- Register new users (basic registration form)  
- Dynamic templates rendered with EJS  

---

## How to Install and Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/lewfer/gs-dwa-berties-books-initial-code berties-books
   cd berties-books
## Installation and Setup

### 1. Install dependencies
```bash
npm install

### 2. Set up MySQL
Open MySQL and create the database using the provided SQL scripts:
```sql
SOURCE create_db.sql;
SOURCE insert_test_data.sql;


