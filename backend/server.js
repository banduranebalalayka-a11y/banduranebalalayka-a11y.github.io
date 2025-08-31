// Підключаємо бібліотеки
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// process.env.PORT потрібен для хостингу, 3000 — для локальної роботи
const PORT = process.env.PORT || 3000;

// Налаштування
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database.json');

// --- ДОПОМІЖНІ ФУНКЦІЇ ---
const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// --- МАРШРУТИ (API ENDPOINTS) ---

// 1. Логін користувача
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users[username];
    if (!user) {
        return res.status(404).json({ message: "Користувача не знайдено" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    if (isPasswordCorrect) {
        res.json({
            message: "Вхід успішний!",
            isAdmin: user.isAdmin,
            carsData: db.cars
        });
    } else {
        res.status(401).json({ message: "Неправильний пароль" });
    }
});

// 2. Додавання нового авто (тільки для адміна)
app.post('/admin/cars', (req, res) => {
    const { subdivision, type, carName, carInfo } = req.body;
    if (!subdivision || !type || !carName || !carInfo) {
        return res.status(400).json({ message: "Не вистачає даних" });
    }
    const db = readDB();
    if (!db.cars[subdivision]) db.cars[subdivision] = {};
    if (!db.cars[subdivision][type]) db.cars[subdivision][type] = {};
    db.cars[subdivision][type][carName] = carInfo;
    writeDB(db);
    res.json({ message: "Авто успішно додано!", carsData: db.cars });
});

// 3. Додавання нового користувача (тільки для адміна)
app.post('/admin/users', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Потрібен логін та пароль" });
    }
    const db = readDB();
    if (db.users[username]) {
        return res.status(409).json({ message: "Такий користувач вже існує" });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    db.users[username] = { passwordHash, isAdmin: false };
    writeDB(db);
    res.json({ message: `Користувача ${username} створено!` });
});

// Запускаємо сервер
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});
