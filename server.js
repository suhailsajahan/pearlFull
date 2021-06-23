import express from 'express';
import cors from 'cors';
import path from 'path';
import users from './api/users.route.js';
import cards from './api/cards.route.js';

const app = express();

app.use(cors());
app.use(express.json())             //same as old body-parser

app.use("/api/v1/users", users);
app.use("/api/v1/cards", cards);
// app.use("*", (req, res) => res.status(404).json({error: "not found"}));

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

export default app