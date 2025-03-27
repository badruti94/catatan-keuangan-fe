import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import "./Chart.css";
import api from "../services/api";

const ChartPage = () => {
    const [data, setData] = useState([]);
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true); // Tambahkan state loading

    useEffect(() => {
        try {
            const fetchData = async () => {
                api.get("/api/categories").then((res) => setCategories(res.data));
            }
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const res = await api.get(`/api/stats?bulan=${month}${category ? `&category_id=${category}` : ""}`);
                setData(res.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Setelah fetch selesai, set loading ke false
            }
        };
        fetchData();
    }, [month, category]);

    return (
        <div className="chart-container">
            <h2>Grafik Pengeluaran</h2>
            <div className="filters">
                <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Semua Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            {loading && <p>Loading data...</p>}
            <div className="chart-wrapper">
                <Chart
                    chartType="ColumnChart"
                    width="100%"
                    height="400px"
                    data={data.length > 0 ? data : [["Kategori", "Pengeluaran", { role: "annotation" }], ["Data Tidak Tersedia", 0, "0"]]}
                    options={{
                        title: `Pengeluaran Per ${!category ? 'Kategori' : 'Sub Kategori'}`,
                        chartArea: { width: "70%" },
                        hAxis: {
                            title: "Kategori",
                        },
                        vAxis: {
                            title: "Jumlah (IDR)",
                            minValue: 0,
                        },
                        annotations: {
                            alwaysOutside: true,
                            textStyle: {
                                fontSize: 12,
                                color: "#000",
                                auraColor: "none",
                            },
                        },
                        legend: { position: "none" },
                    }}
                />
            </div>
        </div>
    );
};

export default ChartPage;
