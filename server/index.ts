import express from 'express';
import { router } from './modules/routes';
import path from 'path';

const port: number = 3000;
const app = express();

app.use(express.json());
app.use(router);

// serve static files from public directory; temp will remove for serving with nginx
app.use(express.static(path.join(__dirname, '..', 'client/public')));

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is up on port: ${port}`);
    console.log(`Visit: http://localhost:${port}/index.html`);
});
