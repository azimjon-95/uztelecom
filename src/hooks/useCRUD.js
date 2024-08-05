import { useState } from "react";
import axios from "../api";

const useCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  let headers = {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(endpoint, headers);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createData = async (newData) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint, newData, headers);
      setData([...data, response.data]);
      return response.data; // Yangi yaratilingan ma'lumotni qaytarish
    } catch (err) {
      setError(err);
      throw err; // Xatolikni tashqariga chiqarish
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${endpoint}/${id}`, updatedData, headers);
      const updatedItems = data.map((item) =>
        item.id === id ? response.data : item
      );
      setData(updatedItems);
      return response.data; // Yangilangan ma'lumotni qaytarish
    } catch (err) {
      setError(err);
      throw err; // Xatolikni tashqariga chiqarish
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${endpoint}/${id}`, headers);
      const filteredData = data.filter((item) => item.id !== id);
      setData(filteredData);
      return id; // O'chirilgan ma'lumotning ID sini qaytarish
    } catch (err) {
      setError(err);
      throw err; // Xatolikni tashqariga chiqarish
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(`${endpoint}`, credentials);
      localStorage.setItem("role", response?.data?.result?.role?.name);
      localStorage.setItem("token", response?.data?.result?.token);
      return response.data;
    } catch (err) {
      setError(err);
      throw err; // Xatolikni tashqariga chiqarish
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    fetchData,
    createData,
    updateData,
    deleteData,
    signIn,
  };
};

export default useCRUD;

