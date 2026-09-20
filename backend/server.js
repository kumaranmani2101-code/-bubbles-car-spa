const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bubbles Car Spa Backend is Running 🚗💦");
});

app.post("/bookings", (req, res) => {
    console.log("NEW BOOKING:", req.body);

    res.json({
        success: true,
        message: "Booking received successfully!"
    });
});

const PORT = 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});