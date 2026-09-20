document.addEventListener("DOMContentLoaded", () => {

    console.log("Bubbles Car Spa website loaded successfully!");

    // Smooth scroll
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // Booking Form
    const bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) {
        console.error("Booking form not found!");
        return;
    }

    bookingForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const bookingData = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            carType: document.getElementById("carType").value,
            service: document.getElementById("service").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            address: document.getElementById("address").value,
            payment: document.getElementById("payment").value
        };

        const message =
            `🚗 *BUBBLES CAR SPA - NEW BOOKING*\n\n` +
            `👤 Name: ${bookingData.name}\n` +
            `📱 Phone: ${bookingData.phone}\n` +
            `🚗 Car Type: ${bookingData.carType}\n` +
            `💦 Service: ${bookingData.service}\n` +
            `📅 Date: ${bookingData.date}\n` +
            `⏰ Time: ${bookingData.time}\n` +
            `📍 Address: ${bookingData.address}\n` +
            `💳 Payment: ${bookingData.payment}`;

        const whatsappURL =
            `https://wa.me/916379203209?text=${encodeURIComponent(message)}`;

        try {
            const response = await fetch("http://192.168.1.2:3000/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const data = await response.json();

            if (data.success) {

                alert("Booking successful! 🚗💦");

                window.open(whatsappURL, "_blank");

                bookingForm.reset();

            } else {

                alert("Booking failed. Please try again.");

            }

        } catch (error) {

            console.error("Booking error:", error);

            alert("Backend connection failed. Make sure the server is running.");

        }

    });

});

    