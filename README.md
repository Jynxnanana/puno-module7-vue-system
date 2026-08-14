# Food Ordering System — Module 7 Prototype

## Student Information
- Name: Ruben L. Puno Jr.
- Course and Section: BSCS 3A
- Subject: Software Engineering 1
- Module: Module 7 - Design and Implementation

## System Description
This is a working frontend prototype of the Order module from the Food Ordering System proposed in Module 6. It allows staff to add, view, edit, delete, and search food orders directly in the browser.

## Selected Module 6 Entity
Order, with fields: customer name, order items, total amount, and status.

## Implemented Features
- Add a new order (Create)
- View all orders in a table (Read)
- Edit an existing order (Update)
- Delete an order with confirmation (Delete)
- Search orders by customer name
- Form validation for required fields
- Data persists after refresh via localStorage

## Technologies Used
- Vue.js 3 + Vite
- Tailwind CSS v4
- JavaScript (Composition API)
- Browser localStorage
- Git + GitHub
- GitHub Actions (CI build check)

## Installation and Run Instructions
1. Clone the repository: git clone https://github.com/Jynxnanana/puno-module7-vue-system.git
2. Go to the project folder: cd puno-module7-vue-system
3. Install dependencies: npm install
4. Run the app: npm run dev
5. Open the local address shown in the terminal example http://localhost:5173/

## About localStorage
This prototype simulates the data layer using the browser's localStorage instead of a real database. All order records are saved under the key module7-records and are read back automatically when the app loads. This is a temporary browser-only substitute for the MongoDB Atlas data layer proposed in the Module 6 architecture.

## Connection Between Module 6 and Module 7
Module 6 proposed a three-tier architecture with Vue.js as the presentation layer, Node.js/Express as the application layer, and MongoDB Atlas as the data layer. Module 7 implements only the presentation layer and a simulated data layer using localStorage for the Order entity, while the backend, API, and database remain proposed future components.

## Screenshots

### Running Application
![Running Application](docs/screenshots/01-running-application.png)

### Add Order
![Add Order](docs/screenshots/02-add-record.png)

### Order List
![Order List](docs/screenshots/03-record-list.png)

### Edit Order
![Edit Order](docs/screenshots/04-edit-record.png)

### Delete Confirmation
![Delete Confirmation](docs/screenshots/05-delete-confirmation.png)

### Search Function
![Search Function](docs/screenshots/06-search-function.png)

### localStorage Data
![localStorage](docs/screenshots/07-localstorage.png)

### Responsive Mobile View
![Responsive View](docs/screenshots/08-responsive-view.png)

### GitHub Repository
![GitHub Repository](docs/screenshots/09-github-repository.png)

### Commit History
![Commit History](docs/screenshots/10-commit-history.png)

### CI Build Success
![CI Success](docs/screenshots/11-ci-success.png)

## Known Limitations and Future Improvements
- No real backend, API, or database connection yet, data is local to the browser only.
- No user authentication or multi-user support.
- Future versions will connect to Node.js/Express and MongoDB Atlas as proposed in Module 6.