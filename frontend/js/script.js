document.addEventListener("DOMContentLoaded", () => {
    const showcase = document.getElementById("showcase");

    const images = [
        "./img/Dojo2.jpg",
        "./img/Dojo1.jpg",
        "./img/Dojo3.jpg"
    ];

    let index = 0;

    function changeBackground() {
        showcase.style.backgroundImage = `url('${images[index]}')`;

        // Apply clip-path and center only for Dojo3.jpg
        if (images[index].includes("Dojo3.jpg")) {
            showcase.childNodes[1].childNodes[1].style.marginTop = "50px";

            // showcase.style.backgroundSize = "cover";
            showcase.style.backgroundPosition = "center"; // Align the top part
            showcase.style.width= "500px";
            showcase.style.height="400px";
            showcase.style.objectFit="cover"
        } else {
            showcase.childNodes[1].childNodes[1].style.marginTop = "100px";

            showcase.style.width= "unset";
            showcase.style.height="unset";
            showcase.style.backgroundSize = "cover"; // Reset clip-path for other images
            showcase.style.backgroundPosition = "center"; // Optionally center other images
        }

        index = (index + 1) % images.length; // Loop through images
    }

    // Set initial background and start changing every 3 seconds
    changeBackground();
    setInterval(changeBackground, 3000);
});

document.getElementById('subscribeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const payload = { email: email };

    try {
        const response = await fetch('https://localhost:7286/api/Subscribers/Create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const result = await response.json();
            alert('Subscription successful!'); // You can handle result here if needed
        } else {
            alert('Failed to subscribe. Please try again.');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});