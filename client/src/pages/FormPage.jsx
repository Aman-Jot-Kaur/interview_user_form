import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
      toast.error("Please fill all mandatory fields: Name, Age, Address, Date");
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
      className="max-w-lg mx-auto bg-white p-6 rounded shadow"
      noValidate
    >
      <h2 className="text-xl font-bold mb-4">Add User</h2>

      <label className="block mb-2">
        Name <span className="text-red-600">*</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block mb-2">
        Age <span className="text-red-600">*</span>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          min={1}
          required
        />
      </label>

      <label className="block mb-2">
        Address <span className="text-red-600">*</span>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block mb-2">
        Date <span className="text-red-600">*</span>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </label>

      <label className="block mb-2">
        Video <span className="text-red-600">*</span>
        <input
          name="video"
          type="file"
          accept="video/*"
          onChange={handleChange}
          className="w-full"
          required
        />
      </label>

      <label className="block mb-2">
        Image 1 <span className="text-red-600">*</span>
        <input
          name="image1"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
          required
        />
      </label>

      <label className="block mb-4">
        Image 2 <span className="text-red-600">*</span>
        <input
          name="image2"
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full"
          required
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
