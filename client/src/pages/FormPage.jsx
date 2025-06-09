import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Formpage.css";

export default function FormPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    address: "",
    date: "",
    video: null,
    image1: null,
    image2: null,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔔 Ask for notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      });
    }
  }, []);

  //  Function to show browser notification
 const showNotification = (name) => {
  console.log("in show")
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(" User Created", {
        body: `${name} has been successfully added!`,
        icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
      });
    } else {
      toast.warn(" Notifications are blocked or not granted");
    }
  } else {
    toast.error(" Notifications are not supported in this browser");
  }
};


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, age, address, date } = form;
    if (!name.trim() || !age || !address.trim() || !date) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("age", age);
      formData.append("address", address);
      formData.append("date", date);
      if (form.video) formData.append("video", form.video);
      if (form.image1) formData.append("image1", form.image1);
      if (form.image2) formData.append("image2", form.image2);

      await axios.post("http://localhost:8001/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("User created successfully!");

      showNotification(name);

      setForm({
        name: "",
        age: "",
        address: "",
        date: "",
        video: null,
        image1: null,
        image2: null,
      });

      setTimeout(() => {
        navigate("/display");
      }, 1000);

    } catch (error) {
      const errMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred";

      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Add User</h2>

      <label>
        Name <span>*</span>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Age <span>*</span>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          min={1}
          required
        />
      </label>

      <label>
        Address <span>*</span>
        <input
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Date <span>*</span>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Video
        <input
          name="video"
          type="file"
          accept="video/*"
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Image 1
        <input
          name="image1"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Image 2
        <input
          name="image2"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
