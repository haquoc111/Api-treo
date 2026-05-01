const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// API gốc cần lấy dữ liệu
const API_URL = "https://wtxmd52.tele68.com/v1/txmd5/lite-sessions?cp=R&cl=R&pf=web&at=62385f65eb49fcb34c72a7d6489ad91d"; // THAY LINK API GỐC

let latestData = null;

// Hàm lấy dữ liệu
async function fetchData() {
    try {
        const response = await axios.get(API_URL);

        latestData = {
            time: new Date().toISOString(),
            data: response.data
        };

        console.log("Đã cập nhật phiên mới");
    } catch (err) {
        console.log("Lỗi lấy API:", err.message);
    }
}

// Chạy lần đầu
fetchData();

// Tự cập nhật mỗi 5 giây
setInterval(fetchData, 5000);

// Route chính
app.get("/", (req, res) => {
    res.json({
        status: "running",
        latestData
    });
});

// API riêng để lấy dữ liệu
app.get("/api", (req, res) => {
    res.json(latestData);
});

app.listen(PORT, () => {
    console.log("Server chạy cổng " + PORT);
});