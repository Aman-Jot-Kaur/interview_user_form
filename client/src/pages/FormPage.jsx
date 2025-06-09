import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Formpage.css"
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

    // Frontend validation for mandatory fields
    const { name, age, address, date } = form;
    if (!name.trim() || !age || !address.trim() || !date) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("age", form.age);
      formData.append("address", form.address);
      formData.append("date", form.date);
      if (form.video) formData.append("video", form.video);
      if (form.image1) formData.append("image1", form.image1);
      if (form.image2) formData.append("image2", form.image2);

      await axios.post("http://localhost:8001/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("User created successfully!");

      // Reset form
      setForm({
        name: "",
        age: "",
        address: "",
        date: "",
        video: null,
        image1: null,
        image2: null,
      });

      // Navigate to display page after success
      navigate("/display");
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
    <form
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 >Add User</h2>

      <label >
        Name <span >*</span>
        <input
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Age <span >*</span>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          min={1}
          required
        />
      </label>

      <label >
        Address <span >*</span>
        <input
          name="address"
          type="text"
          value={form.address}
          onChange={handleChange}
          required
        />
      </label>

      <label >
        Date <span >*</span>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </label>

      <label >
        Video <span ></span>
        <input
          name="video"
          type="file"
          accept="video/*"
          onChange={handleChange}
          required
        />
      </label>

      <label >
        Image 1 <span ></span>
        <input
          name="image1"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
          required
        />
      </label>

      <label >
        Image 2 <span ></span>
        <input
          name="image2"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
       
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
