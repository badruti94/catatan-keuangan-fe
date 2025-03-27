import React, { useEffect, useState } from "react";
import API from '../services/api'
import "./ExpenseList.css";

const ExpenseListPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [loading, setLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        setLoading(true);
        fetchExpenses();
        fetchCategories();
    }, [selectedMonth, selectedCategory, selectedSubCategory]);

    const fetchExpenses = async () => {
        try {
            let url = `/api/expenses?bulan=${selectedMonth}`;
            if (selectedCategory) url += `&category_id=${selectedCategory}`;
            if (selectedSubCategory) url += `&sub_category_id=${selectedSubCategory}`;

            const response = await API.get(url);
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        } finally {
            setLoading(false); // Setelah fetch selesai, set loading ke false
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await API.get("/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSubCategories = async (categoryId) => {
        try {
            const response = await API.get(`/api/sub-categories?category_id=${categoryId}`);
            setSubCategories(response.data);
        } catch (error) {
            console.error("Error fetching sub-categories:", error);
        }
    };

    return (
        <div className="container">
            <h2>Daftar Pengeluaran</h2>
            <div className="filters">
                <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
                <select value={selectedCategory} onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("");
                    fetchSubCategories(e.target.value);
                }}>
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)}>
                    <option value="">Pilih Sub Kategori</option>
                    {subCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                </select>
            </div>
            {loading && <p>Loading data...</p>}
            <div className="table-container">
                <table className="expense-table">
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Kategori</th>
                            <th>Sub Kategori</th>
                            <th>Jumlah</th>
                            <th>Catatan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense) => (
                            <tr key={expense.id}>
                                <td>
                                    {new Date(expense.date).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                    })}{" "}
                                    {new Date(expense.date).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                    })}
                                </td>
                                <td>{expense.category_name}</td>
                                <td>{expense.sub_category_name}</td>
                                <td>{expense.amount}</td>
                                <td>{expense.notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseListPage;
