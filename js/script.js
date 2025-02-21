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
            showcase.style.backgroundSize = "60% 100%";
            showcase.style.backgroundPosition = "center"; // Align the top part
        } else {
            showcase.style.backgroundSize = "cover"; // Reset clip-path for other images
            showcase.style.backgroundPosition = "center"; // Optionally center other images
        }

        index = (index + 1) % images.length; // Loop through images
    }

    // Set initial background and start changing every 3 seconds
    changeBackground();
    setInterval(changeBackground, 3000);
});