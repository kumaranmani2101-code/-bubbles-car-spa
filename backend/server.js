const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://ljmgqvjtgapwsrguksvf.supabase.co";
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bubbles Car Spa Backend is Running 🚗💦");
});

app.post("/bookings", async (req, res) => {
    console.log("NEW BOOKING:", req.body);

    const {
        name,
        phone,
        carType,
        service,
        date,
        time,
        address,
        payment
    } = req.body;

    const { data, error } = await supabase
        .from("bookings")
        .insert([{
            customer_name: name,
            phone: phone,
            car_type: carType,
            service: service,
            date: date,
            time: time,
            address: address,
            payment: payment
        }])
        .select();

    if (error) {
        console.error("SUPABASE ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save booking."
        });
    }

    res.json({
        success: true,
        message: "Booking saved successfully!",
        booking: data[0]
    });
});

const PORT = 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
    console.error("SERVER ERROR:", error);
});