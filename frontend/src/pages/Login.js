import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        const res = await axios.post("/api/auth/register", form);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/events");
      } else {
        const res = await axios.post("/api/auth/login", {
          email: form.email,
          password: form.password
        });
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/events");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>
          {isRegister ? "Register" : "Login"}
        </h1>

        {isRegister && (
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={styles.input}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.mainBtn}>
          {isRegister ? "Register" : "Login"}
        </button>

        <p style={styles.text}>
          {isRegister ? "Already have an account?" : "New here?"}
        </p>

        <button
          onClick={() => setIsRegister(!isRegister)}
          style={styles.switchBtn}
        >
          {isRegister ? "Go to Login" : "Go to Register"}
        </button>

        <p style={styles.note}>
          Admin login: admin@gmail.com / 123456
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1a1a1a, #3b0a0a)"
  },
  card: {
    width: "360px",
    background: "#111111",
    padding: "30px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(255,0,0,0.25)",
    border: "1px solid #3b0000"
  },
  heading: {
    textAlign: "center",
    color: "#ff4d4d",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#1c1c1c",
    color: "white",
    outline: "none"
  },
  mainBtn: {
    width: "100%",
    padding: "12px",
    background: "#d90429",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  text: {
    textAlign: "center",
    color: "#cccccc",
    marginTop: "15px",
    marginBottom: "8px"
  },
  switchBtn: {
    width: "100%",
    padding: "10px",
    background: "#222",
    color: "#ff6666",
    border: "1px solid #550000",
    borderRadius: "8px",
    cursor: "pointer"
  },
  note: {
    marginTop: "15px",
    textAlign: "center",
    color: "#999",
    fontSize: "13px"
  }
};

export default Login;