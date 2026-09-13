import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);

    const getMe = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3000/api/auth/getMe",
                {
                    withCredentials: true,
                }
            );

            console.log("Current user:", response.data);

            setUser(response.data.user);
        } catch (error) {
            console.error(
                "Get Me error:",
                error.response?.data?.message || error.message
            );
        }
    };

    useEffect(() => {
        getMe();
    }, []);

    return (
        <div>
            <h2>Current User</h2>

            {user && (
                <div>
                    <p>ID: {user.id}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
    );
};

export default Profile;