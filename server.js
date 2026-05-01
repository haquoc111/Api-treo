const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// API gốc
const API_URL = "https://wtxmd52.tele68.com/v1/txmd5/lite-sessions?cp=R&cl=R&pf=web&at=62385f65eb49fcb34c72a7d6489ad91d";

let history = [];

// Hàm lấy dữ liệu
async function fetchData() {
    try {
        const response = await axios.get(API_URL);

        const newData = {
            time: new Date().toISOString(),
            data: response.data
        };

        // Thêm vào lịch sử
        history.push(newData);

        console.log("Đã lưu phiên:", history.length);

    } catch (err) {
        console.log("Lỗi:", err.message);
    }
}

// Chạy lần đầu
fetchData();

// Lặp mỗi 5 giây
setInterval(fetchData, 5000);

// Trang chủ
app.get("/", (req, res) => {
    res.json({
        status: "running",
        total: history.length
    });
});

// Xem toàn bộ phiên
app.get("/api", (req, res) => {
    res.json(history);
});

// Xem phiên mới nhất
app.get("/latest", (req, res) => {
    res.json(history[history.length - 1] || {});
});

app.listen(PORT, () => {
    console.log("Server chạy cổng", PORT);
});