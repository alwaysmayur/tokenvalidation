import Layout from "../layouts/Layout";
import { useEffect, useState } from "react";

export default function Home() {
    const [message, setMessage] = useState('');
    const [auth, setAuth] = useState(false);

    useEffect(() => {
        (
            async () => {
                try {
                    let token = localStorage.getItem("usersdatatoken");
                    console.log({ token });
                    const response = await fetch('/api/validuser', {
                        headers: {
                            'Authorization': `Bearer ${token}`,

                        },
                        credentials: 'include'
                    });

                    const content = await response.json();
                    console.log({ content })
                    setMessage(`Hi ${content.ValidUserOne.fname}`);
                    setAuth(true);
                } catch (e) {
                    console.log(e)
                    setMessage('You are not logged in');
                    setAuth(false);
                }
            }
        )();
    });

    return (
        <Layout auth={auth}>
            {message}
        </Layout>
    )
}
