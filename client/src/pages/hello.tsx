import { API_PREFIX } from '@constants/config';
import { useEffect, useState } from "react";

const Hello = ({}) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getHello = async () => {
            const hello = await fetch(API_PREFIX + '/hello', {
                method: 'GET',
                // headers: {},
                // body: JSON.stringify({}), // data can be a string or {object}!
            });

            console.log("Sending req to: ", API_PREFIX + '/hello')
            console.log(hello);

            // .then(response => response.text())
            // .then(data => setMessage(data));

            const data = await hello.text();
            setMessage(data);
        }

        getHello();
    }, []);

    return <div>{message}</div>;
}

export default Hello;