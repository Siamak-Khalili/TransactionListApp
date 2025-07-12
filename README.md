TransactionListApp
A JavaScript-based web application for displaying, searching, and sorting financial transactions. Built as part of a JavaScript course, this project uses a mock API with JSON Server, supports Persian (Jalali) date formatting, and features a responsive, RTL (right-to-left) user interface.
Table of Contents

Features
Technologies
Setup and Installation
Usage
Project Structure
License

Features

Load Transactions: Fetch and display transactions with a single button click.
Search: Filter transactions by reference ID using API queries.
Sort: Sort transactions by price or date (ascending/descending) with smooth arrow rotation animation.
Persian Date Support: Display transaction dates in Jalali format with time.
Responsive Design: RTL layout with responsive search input and typography.
Loading Animation: Visual feedback during data fetching with a custom loader.
Error Handling: Graceful handling of API errors with console logging.

Technologies

Frontend:
HTML5, CSS3, JavaScript (ES6)
Axios for API requests
Vazirmatn font for Persian typography


Backend:
JSON Server for mock API


Tools:
Live Server for local development
npm for dependency management



Setup and Installation
To run the project locally, follow these steps:

Clone the Repository:
git clone https://github.com/your-username/TransactionListApp.git
cd TransactionListApp


Install Dependencies:Ensure Node.js is installed, then run:
npm install


Run JSON Server:Start the mock API server:
npm run server

This will serve the API at http://localhost:3000/transactions.

Open with Live Server:

Install the Live Server extension in VS Code (or use another local server).
Open index.html with Live Server to view the application in your browser.



Usage

Load Transactions:
Click the "بارگذاری تراکنش‌ها" button to fetch and display transactions in a table.


Search:
Enter a reference ID in the search input to filter transactions.


Sort:
Use the dropdown menus in the table header to sort by price or date.
The arrow icon rotates smoothly to indicate sort direction.


View:
Transactions are displayed with ID, type (deposit/withdraw), price, reference ID, and Jalali date with time.


License
This project is licensed under the MIT License. See the LICENSE file for details.
