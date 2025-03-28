import axios from 'axios'
import { useEffect, useState } from 'react'
import "./input-styles.css";
import ProtectedRoute from '../components/ProtectedRoute';
import api from '../services/api';

// InputPage.js
function InputPage() {
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [notes, setNotes] = useState("");
    const [notification, setNotification] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get("/api/categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Gagal mengambil kategori", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (category) {
            const fetchSubCategories = async () => {
                try {
                    const response = await api.get(`/api/sub-categories?category_id=${category}`);
                    setSubCategories(response.data);
                } catch (error) {
                    console.error("Gagal mengambil sub kategori", error);
                }
            };
            fetchSubCategories();
        } else {
            setSubCategories([]);
        }
    }, [category]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/expenses", {
                sub_category_id: subCategory,
                amount,
                notes,
            });
            setNotification("Pengeluaran berhasil ditambahkan!");
            setTimeout(() => setNotification(""), 3000);
            setCategory("");
            setSubCategory("");
            setAmount("");
            setNotes("");
        } catch (error) {
            console.error("Gagal menambahkan pengeluaran", error);
        }
    };

    return (
        <ProtectedRoute>
            <div className="input-container">
                <h2>Input Pengeluaran</h2>
                {notification && <div className="notification">{notification}</div>}
                <form onSubmit={handleSubmit} className="expense-form">
                    <label>Kategori:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Pilih Kategori</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <label>Sub Kategori:</label>
                    <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} disabled={!category}>
                        <option value="">Pilih Sub Kategori</option>
                        {subCategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                    </select>
                    <label>Jumlah:</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <label>Catatan:</label>
                    <textarea name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows="3" placeholder="Tambahkan catatan..." />
                    <button type="submit" className="submit-button">Tambah</button>
                </form>
            </div>
        </ProtectedRoute>
    );
}

export default InputPage