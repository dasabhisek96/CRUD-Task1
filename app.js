const express = require('express');
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const connection = require('./config/db');

const app = express();

app.use(bodyParser.json());
app.use('/api', contactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        mobile_number VARCHAR(255) NOT NULL
    )
`;
connection.query(createTableQuery, (err, results) => {
    if (err) throw err;
    console.log('Contacts table ready.');
});
