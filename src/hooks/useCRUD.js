import { useState } from 'react';
import axios from '../api';

const useCRUD = (endpoint) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(endpoint);
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
            const response = await axios.post(endpoint, newData);
            setData([...data, response.data]);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const updateData = async (id, updatedData) => {
        setLoading(true);
        try {
            const response = await axios.put(`${endpoint}/${id}`, updatedData);
            setData(data.map((item) => (item.id === id ? response.data : item)));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteData = async (id) => {
        setLoading(true);
        try {
            await axios.delete(`${endpoint}/${id}`);
            setData(data.filter((item) => item.id !== id));
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (credentials) => {
        setLoading(true);
        try {
            const response = await axios.post(`${endpoint}`, credentials);
            localStorage.setItem('role', response.data.role);
            return response.data;
        } catch (err) {
            setError(err);
            throw err; // Xatolikni tashqariga chiqarish
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, fetchData, createData, updateData, deleteData, signIn };
};

export default useCRUD;
