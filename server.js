const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ===== API GỐC =====
const API_URL = "https://wtxmd52.tele68.com/v1/txmd5/lite-sessions?cp=R&cl=R&pf=web&at=62385f65eb49fcb34c72a7d6489ad91d"; // THAY API THẬT

// ===== LƯU 10000 PHIÊN =====
let history = [];

// ===== CHỐNG TRÙNG =====
let lastSession = null;

// ===== HÀM LẤY DỮ LIỆU =====
async function fetchData() {
    try {

        const response = await axios.get(API_URL, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json"
            },
            timeout: 10000
        });

        // ===== DATA API =====
        const raw = response.data;

        // ===== CHỈNH THEO API =====
        const session =
            raw.session ||
            raw.phien ||
            raw.id ||
            raw.gameId;

        const result =
            raw.result ||
            raw.ketqua ||
            raw.value;

        // ===== KIỂM TRA =====
        if (!session || !result) {
            console.log("Không tìm thấy phiên/kết quả");
            return;
        }

        // ===== CHỐNG LƯU TRÙNG =====
        if (session === lastSession) {
            return;
        }

        lastSession = session;

        // ===== TẠO DỮ LIỆU =====
        const newData = {
            session: session,
            result: result,
            time: new Date().toISOString()
        };

        // ===== THÊM VÀO LỊCH SỬ =====
        history.push(newData);

        // ===== GIỮ TỐI ĐA 10000 =====
        if (history.length > 10000) {
            history.shift();
        }

        console.log(
            `Phiên: ${session} | KQ: ${result} | Tổng: ${history.length}`
        );

    } catch (err) {
        console.log("Lỗi API:", err.message);
    }
}

// ===== CHẠY NGAY =====
fetchData();

// ===== AUTO FETCH =====
setInterval(fetchData, 5000);

// ===== TRANG CHÍNH =====
app.get("/", (req, res) => {
    res.json({
        status: "running",
        total: history.length,
        latest: history[history.length - 1],
        history: history
    });
});

// ===== CHỈ LẤY PHIÊN MỚI =====
app.get("/latest", (req, res) => {
    res.json(history[history.length - 1] || {});
});

// ===== TOÀN BỘ 10000 PHIÊN =====
app.get("/all", (req, res) => {
    res.json(history);
});

// ===== CHECK ONLINE =====
app.get("/ping", (req, res) => {
    res.json({
        status: "alive",
        time: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log("Server chạy cổng " + PORT);
});