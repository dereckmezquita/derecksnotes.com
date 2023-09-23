import { useEffect, useState } from "react";

// TODO: this is test code
const HelloWorld = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello', {
            method: 'GET',
            // headers: {},
            // body: JSON.stringify({}), // data can be a string or {object}!
        })
            .then(response => response.text())
            .then(data => setMessage(data));
    }, []);

    return <div>{message}</div>;
}

export default HelloWorld;