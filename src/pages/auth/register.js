import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register(){
    const [username,setUsername]=useState("");
    const [email,setEmail] = useState("");
    const router = useRouter();

    const handleRegister = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users") || "[]");

        if (users.find((user) => user.email === email)) {
            alert("Email already registered!");
            return;
        }

        users.push({ username, email });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Registered successfully!");
        router.push("/auth/login");
    };

    return (
        <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            <input
            className="p-2 border rounded"
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            />
            <input
            className="p-2 border rounded"
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            />
            <button className="bg-blue-600 text-white p-2 rounded" type="submit">
            Register
            </button>
        </form>
        </div>
    );
}
    