const axios = require('axios');
const connection = require('../config/db');

const FRESHSALES_API_KEY = 'your_freshsales_api_key';
const FRESHSALES_BASE_URL = 'https://your_domain.freshsales.io/api/contacts';

const getHeaders = () => ({
    'Authorization': `Token token=${FRESHSALES_API_KEY}`,
    'Content-Type': 'application/json'
});


exports.createContact = async (req, res) => {
    const { first_name, last_name, email, mobile_number, data_store } = req.body;
    if (data_store === 'CRM') {
        try {
            const response = await axios.post(FRESHSALES_BASE_URL, {
                contact: { first_name, last_name, email, mobile_number }
            }, { headers: getHeaders() });

            res.status(201).json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (data_store === 'DATABASE') {
        const sql = 'INSERT INTO contacts (first_name, last_name, email, mobile_number) VALUES (?, ?, ?, ?)';
        connection.query(sql, [first_name, last_name, email, mobile_number], (err, results) => {
            if (err) throw err;
            res.status(201).json({ id: results.insertId, first_name, last_name, email, mobile_number });
        });
    } else {
        res.status(400).json({ error: 'Invalid data_store value' });
    }
};


exports.getContact = async (req, res) => {
    const { contact_id, data_store } = req.body;
    if (data_store === 'CRM') {
        try {
            const response = await axios.get(`${FRESHSALES_BASE_URL}/${contact_id}`, { headers: getHeaders() });
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (data_store === 'DATABASE') {
        const sql = 'SELECT * FROM contacts WHERE id = ?';
        connection.query(sql, [contact_id], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({ error: 'Contact not found' });
            }
        });
    } else {
        res.status(400).json({ error: 'Invalid data_store value' });
    }
};


exports.updateContact = async (req, res) => {
    const { contact_id, new_email, new_mobile_number, data_store } = req.body;
    if (data_store === 'CRM') {
        try {
            const response = await axios.put(`${FRESHSALES_BASE_URL}/${contact_id}`, {
                contact: { email: new_email, mobile_number: new_mobile_number }
            }, { headers: getHeaders() });

            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (data_store === 'DATABASE') {
        const sql = 'UPDATE contacts SET email = ?, mobile_number = ? WHERE id = ?';
        connection.query(sql, [new_email, new_mobile_number, contact_id], (err, results) => {
            if (err) throw err;
            res.json({ id: contact_id, email: new_email, mobile_number: new_mobile_number });
        });
    } else {
        res.status(400).json({ error: 'Invalid data_store value' });
    }
};


exports.deleteContact = async (req, res) => {
    const { contact_id, data_store } = req.body;
    if (data_store === 'CRM') {
        try {
            await axios.delete(`${FRESHSALES_BASE_URL}/${contact_id}`, { headers: getHeaders() });
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (data_store === 'DATABASE') {
        const sql = 'DELETE FROM contacts WHERE id = ?';
        connection.query(sql, [contact_id], (err, results) => {
            if (err) throw err;
            res.status(204).send();
        });
    } else {
        res.status(400).json({ error: 'Invalid data_store value' });
    }
};
