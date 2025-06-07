import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./displayPage.css";

export default function DisplayPage() {
  const [date, setDate] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format YYYY-MM-DD → MM-DD-YYYY for backend API
  const formatDateToMMDDYYYY = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    return `${month}-${day}-${year}`;
  };

  const fetchUsersByDate = async () => {
    if (!date) {
      toast.warn("Please select a date");
      return;
    }
    setLoading(true);
    try {
      const formattedDate = formatDateToMMDDYYYY(date);
      const res = await axios.get(`http://localhost:8001/date/${formattedDate}`);
      setUsers(res.data);
      if (res.data.length === 0) toast.info("No users found for this date");
    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";
      toast.error(errMsg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Display Users by Date</h2>

      <div className="controls">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="Select date"
        />
        <button onClick={fetchUsersByDate} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Desktop Table */}
      {users.length > 0 && (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Address</th>
                <th>Date</th>
                <th>Video</th>
                <th>Image 1</th>
                <th>Image 2</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uuid}>
                  <td>{u.name}</td>
                  <td>{u.age}</td>
                  <td>{u.address}</td>
                  <td>{new Date(u.date).toLocaleDateString()}</td>
                  <td>
                    {u.video ? (
                      <a
                        href={`http://localhost:8001/${u.video}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Video
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {u.image1 ? (
                      <img
                        src={`http://localhost:8001/${u.image1}`}
                        alt="Image 1"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {u.image2 ? (
                      <img
                        src={`http://localhost:8001/${u.image2}`}
                        alt="Image 2"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="user-list">
            {users.map((u) => (
              <div className="user-card" key={u.uuid}>
                <p><strong>Name:</strong> {u.name}</p>
                <p><strong>Age:</strong> {u.age}</p>
                <p><strong>Address:</strong> {u.address}</p>
                <p><strong>Date:</strong> {new Date(u.date).toLocaleDateString()}</p>
                <p>
                  <strong>Video:</strong>{" "}
                  {u.video ? (
                    <a
                      href={`http://localhost:8001/${u.video}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch Video
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Image 1:</strong>{" "}
                  {u.image1 ? (
                    <img
                      src={`http://localhost:8001/${u.image1}`}
                      alt="Image 1"
                    />
                  ) : (
                    "N/A"
                  )}
                </p>
                <p>
                  <strong>Image 2:</strong>{" "}
                  {u.image2 ? (
                    <img
                      src={`http://localhost:8001/${u.image2}`}
                      alt="Image 2"
                    />
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
