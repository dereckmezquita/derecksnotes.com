
import express from 'express';
import path from 'path';

// pass port from node file.js 3000
const port: string | undefined = process.argv[2];

if(!port) {
    throw new Error('You need to specify a port for express dev server to run on!');
}

const root = path.join(__dirname, '../../../');

const app = express();

app.use(express.static(path.join(root, 'client', 'public')));

// + casts port to number
const listener = app.listen(+port, '0.0.0.0', () => {
    console.log(`Server is up on port ${port}`);
})
