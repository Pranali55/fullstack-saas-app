import { useState } from "react";
import API from "../api";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/register", { username, password });
      alert("User created! Please login.");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <>
      <h2>Register</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </>
  );
}

export default Register;