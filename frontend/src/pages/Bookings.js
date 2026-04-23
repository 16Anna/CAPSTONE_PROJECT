import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Bookings() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUser = user?.user || user;

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get(
      `https://capstone-project-jpbp.onrender.com/api/bookings/${currentUser._id}`
    );
    setData(res.data);
  };

  const handleCancel = async (id) => {
    try {
      await axios.delete(
        `https://capstone-project-jpbp.onrender.com/api/bookings/${id}`
      );
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.topRight}>
        <button onClick={() => navigate("/events")} style={styles.topBtn}>
          Back to Events
        </button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>My Bookings</h2>

        <div style={styles.grid}>
          {data.length === 0 && (
            <p style={styles.emptyText}>No bookings found</p>
          )}

          {data.map((b) => (
            <div key={b._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{b.eventId?.title}</h3>
              <p style={styles.cardText}>{b.eventId?.description}</p>
              <p style={styles.cardText}>Date: {b.eventId?.date}</p>
              <p style={styles.cardText}>Venue: {b.eventId?.venue}</p>

              <button
                onClick={() => handleCancel(b._id)}
                style={styles.cancelBtn}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1a1a1a, #2b0000)",
    paddingTop: "60px",
    display: "flex",
    justifyContent: "center"
  },
  topRight: {
    position: "fixed",
    top: "20px",
    right: "20px"
  },
  topBtn: {
    padding: "10px 14px",
    background: "#222",
    color: "#ff6666",
    border: "1px solid #550000",
    borderRadius: "8px",
    cursor: "pointer"
  },
  container: {
    width: "100%",
    maxWidth: "1100px"
  },
  heading: {
    textAlign: "center",
    color: "#ff4d4d",
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px"
  },
  card: {
    background: "#111",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #3b0000",
    boxShadow: "0 8px 24px rgba(255,0,0,0.12)"
  },
  cardTitle: {
    color: "#ff6666"
  },
  cardText: {
    color: "#dddddd"
  },
  cancelBtn: {
    marginTop: "12px",
    padding: "10px 14px",
    background: "#d90429",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  emptyText: {
    color: "#cccccc"
  }
};

export default Bookings;