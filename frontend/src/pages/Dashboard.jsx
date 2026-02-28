import { useState, useEffect } from "react";
import API from "../api";

function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const createTask = async () => {
    if (!title) return;
    await API.post("/tasks", { title });
    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Your Tasks</h2>
        <button style={{ width: "120px" }} onClick={logout}>
          Logout
        </button>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          placeholder="New task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button style={{ width: "120px" }} onClick={createTask}>
          Add
        </button>
      </div>

      <div style={{ marginTop: "30px" }}>
        {tasks.length === 0 ? (
          <p style={{ opacity: 0.6 }}>No tasks yet. Add one 🚀</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="task"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{task.title}</span>
              <button
                style={{
                  width: "90px",
                  background: "#ef4444",
                }}
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;