const express = require('express');
const app = express.Router();

const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'lHvXblfDM3nWtDmkdQQTXKnOWtFWvFL4', (err, decoded) => {
        if (err) {
        return res.status(401).json({
            message: 'Auth failed'
        });
        }
        req.userData = decoded;
        next();
    });
    }
);

module.exports = app;
