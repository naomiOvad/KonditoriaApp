# KonditoriaApp

Full-stack bakery website
The project is split into two parts:
- **Frontend (React):** Handles the UI – product catalog, cart sidebar, navigation, and user authentication.
- **Backend (Node.js + Express):** Manages users and products, storing data in JSON files.

## Features
- Product catalog (cakes, cookies, pastries) from JSON file
- Shopping cart sidebar with checkout option
- User registration & login (stored in JSON file)
- Access control – certain components (e.g. NavBar, ProductList) only visible to logged-in users
- Backend API reads and writes to JSON files (instead of a database)

## Technologies
- **Frontend:** React, React Router, CSS
- **Backend:** Node.js, Express
- **Data storage:** JSON files

## Installation & Run

### Backend
```bash
cd node.js
npm install
npm run dev
```
### Frontend
```bash
cd react
npm install
npm start
