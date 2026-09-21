const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://ljmgqvjtgapwsrguksvf.supabase.co";
const supabase = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY);
const express = require("express");
const crypto = require("crypto");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bubbles Car Spa Backend is Running 🚗💦");
});
function adminAuth(req, res, next) {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const token = auth.substring(7);

    const expectedToken = crypto
        .createHmac("sha256", process.env.ADMIN_API_KEY)
        .update("BUBBLES_ADMIN")
        .digest("hex");

    if (token !== expectedToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    next();
}
    
app.get("/bookings", adminAuth, async (req, res) => {
    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("FETCH BOOKINGS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings."
        });
    }

    res.json({
        success: true,
        bookings: data
    });
});
app.post("/admin/login", (req, res) => {
    const { password } = req.body;

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({
            success: false,
            message: "Invalid password"
        });
    }

    const token = crypto
        .createHmac("sha256", process.env.ADMIN_API_KEY)
        .update("BUBBLES_ADMIN")
        .digest("hex");

    res.json({
        success: true,
        token: token
    });
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