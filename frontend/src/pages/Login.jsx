import { useState } from "react";
import API from "../api";

function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("token", res.data.access_token);
      setToken(res.data.access_token);
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <h2>Login</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </>
  );
}

export default Login;