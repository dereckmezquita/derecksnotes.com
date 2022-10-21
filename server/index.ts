import express from 'express';
import { router, initDB } from './modules/routes';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

const port: number = 3001;
const app = express();

app.use(express.json());
app.use(router);

// serve static files from public directory; temp will remove for serving with nginx
// app.use(express.static(path.join(__dirname, '..', 'client/public')));

new MongoClient('mongodb://localhost:27017', {serverSelectionTimeoutMS: 1000}).connect().then(client => {
    initDB(client);

    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is up on port: ${port}`);
        console.log(`Visit: http://localhost:${port}/index.html`);
    });
});
