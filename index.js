//Connect to the DB and start the server

import app from './server.js';
import mongodb from 'mongodb';
import dotenv from 'dotenv';
import UsersDAO from './data_access_object/usersDAO.js'
import CardsDAO from './data_access_object/cardsDAO.js'
dotenv.config();

const mongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

mongoClient.connect(
    process.env.PEARL_DB_URI, 
    {
        poolSize:50,
        wtimeout:3000,
        useNewUrlParser:true
    }
)
.catch( err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    await UsersDAO.injectDB(client)
    await CardsDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening to port ${port}`)
    })
})