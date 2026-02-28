import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState(localStorage.getItem("token"));

  if (token) {
    return <Dashboard setToken={setToken} />;
  }

  return (
    <div className="container">
      {page === "login" ? (
        <>
          <Login setToken={setToken} />
          <p>
            Don't have an account?{" "}
            <span onClick={() => setPage("register")} style={{ cursor: "pointer", color: "#3b82f6" }}>
              Register
            </span>
          </p>
        </>
      ) : (
        <>
          <Register />
          <p>
            Already have an account?{" "}
            <span onClick={() => setPage("login")} style={{ cursor: "pointer", color: "#3b82f6" }}>
              Login
            </span>
          </p>
        </>
      )}
    </div>
  );
}

export default App;