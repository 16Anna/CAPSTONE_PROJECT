import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Events() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const currentUser = user?.user || user;

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    totalSeats: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/api/events");
    setEvents(res.data);
  };

  const handleAdd = async () => {
    try {
      await axios.post("http://localhost:5000/api/events", form);
      setForm({
        title: "",
        description: "",
        date: "",
        venue: "",
        totalSeats: ""
      });
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding event");
    }
  };

  const handleBook = async (id) => {
    try {
      await axios.post("http://localhost:5000/api/bookings", {
        userId: currentUser._id,
        eventId: id
      });
      alert("Booked Successfully");
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredEvents = events.filter((e) => {
    return (
      e.title.toLowerCase().includes(search.toLowerCase()) &&
      (filterDate === "" || e.date === filterDate)
    );
  });

  const upcomingEvents = filteredEvents.filter(
    (e) => new Date(e.date) >= new Date()
  );

  const pastEvents = filteredEvents.filter(
    (e) => new Date(e.date) < new Date()
  );

  return (
    <div style={styles.page}>
      <div style={styles.topRight}>
        <button onClick={() => navigate("/bookings")} style={styles.topBtn}>
          My Bookings
        </button>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>Events Dashboard</h2>

        <div style={styles.filterBox}>
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={styles.input}
          />
        </div>

        {currentUser?.role === "admin" && (
          <div style={styles.formCard}>
            <h3 style={styles.formHeading}>Add Event</h3>

            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              style={styles.input}
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Venue"
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              style={styles.input}
            />

            <input
              placeholder="Total Seats"
              value={form.totalSeats}
              onChange={(e) =>
                setForm({ ...form, totalSeats: e.target.value })
              }
              style={styles.input}
            />

            <button onClick={handleAdd} style={styles.addBtn}>
              Add Event
            </button>
          </div>
        )}

        <h3 style={styles.sectionTitle}>Upcoming Events</h3>
        <div style={styles.grid}>
          {upcomingEvents.length === 0 && (
            <p style={styles.emptyText}>No upcoming events</p>
          )}

          {upcomingEvents.map((e) => (
            <div key={e._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{e.title}</h3>
              <p style={styles.cardText}>{e.description}</p>
              <p style={styles.cardText}>Date: {e.date}</p>
              <p style={styles.cardText}>Venue: {e.venue}</p>
              <p style={styles.cardSeats}>
                Seats: {e.bookedSeats} / {e.totalSeats}
              </p>

              <div style={styles.row}>
                <button
                  onClick={() => handleBook(e._id)}
                  disabled={e.bookedSeats >= e.totalSeats}
                  style={styles.bookBtn}
                >
                  {e.bookedSeats >= e.totalSeats ? "Full" : "Book"}
                </button>

                {currentUser?.role === "admin" && (
                  <button
                    onClick={() => handleDelete(e._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <h3 style={styles.sectionTitle}>Past Events</h3>
        <div style={styles.grid}>
          {pastEvents.length === 0 && (
            <p style={styles.emptyText}>No past events</p>
          )}

          {pastEvents.map((e) => (
            <div key={e._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{e.title}</h3>
              <p style={styles.cardText}>{e.description}</p>
              <p style={styles.cardText}>Date: {e.date}</p>
              <p style={styles.cardText}>Venue: {e.venue}</p>
              <p style={styles.completedText}>Event Completed</p>
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
    right: "20px",
    display: "flex",
    gap: "10px"
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
  filterBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  formCard: {
    background: "#111",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #3b0000",
    boxShadow: "0 8px 24px rgba(255,0,0,0.15)",
    marginBottom: "25px"
  },
  formHeading: {
    color: "#ff6666",
    textAlign: "center",
    marginBottom: "15px"
  },
  input: {
    padding: "12px",
    width: "100%",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#1c1c1c",
    color: "white",
    outline: "none"
  },
  addBtn: {
    width: "100%",
    padding: "12px",
    background: "#d90429",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  sectionTitle: {
    color: "#ff9999",
    marginTop: "25px",
    marginBottom: "12px"
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
  cardSeats: {
    color: "#ffb3b3",
    fontWeight: "bold"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "12px"
  },
  bookBtn: {
    padding: "10px 14px",
    background: "#d90429",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  deleteBtn: {
    padding: "10px 14px",
    background: "#222",
    color: "#ff6666",
    border: "1px solid #550000",
    borderRadius: "8px",
    cursor: "pointer"
  },
  topBtn: {
    padding: "10px 14px",
    background: "#222",
    color: "#ff6666",
    border: "1px solid #550000",
    borderRadius: "8px",
    cursor: "pointer"
  },
  logoutBtn: {
    padding: "10px 14px",
    background: "#d90429",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  completedText: {
    color: "#ff4d4d",
    fontWeight: "bold"
  },
  emptyText: {
    color: "#cccccc"
  }
};

export default Events;