import { useState } from "react";
import axios from "../api";

const useCRUD = (endpoint) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Default headers for general requests
  const defaultHeaders = {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // Headers for file uploads
  const fileUploadHeaders = {
    headers: {
      "Content-Type": "multipart/form-data",
      accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(endpoint, defaultHeaders, fileUploadHeaders);
      setData(response);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createData = async (newData) => {
    setLoading(true);
    try {
      const response = await axios.post(endpoint, newData, fileUploadHeaders);
      setData([...data, response.data]);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateData = async (id, updatedData) => {
    setLoading(true);
    try {
      const response = await axios.put(`${endpoint}/${id}`, updatedData, defaultHeaders);
      const updatedItems = data.map((item) =>
        item.id === id ? response.data : item
      );
      setData(updatedItems);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${endpoint}/${id}`, defaultHeaders);
      const filteredData = data.filter((item) => item.id !== id);
      setData(filteredData);
      return id;
    } catch (err) {
      setError(err);
      throw err;
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
      localStorage.setItem("workerId", response?.data?.result?.id);

      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFileData = async (fileId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/file/show/${fileId}`, defaultHeaders);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
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
    getFileData,
  };
};

export default useCRUD;



