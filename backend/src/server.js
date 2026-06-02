import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    rse.json({ message: "Kết nối thành công!" });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
})