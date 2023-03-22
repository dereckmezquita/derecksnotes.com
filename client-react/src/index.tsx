import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);

// reminder: commands to run React apps are 
// 1. npm start: runs the app in the development mode.
// 2. npm run build: builds the app for production to the build folder.
// 3. npm run eject: removes this tool and copies build dependencies, configuration files and scripts into the app directory. If you do this, you can’t go back!