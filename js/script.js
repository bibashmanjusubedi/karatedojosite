document.addEventListener("DOMContentLoaded", () => {
    const showcase = document.getElementById("showcase");
    
    // Array of background images
    const images = [
        "./img/freelancer.jpg",
        "./img/showcase2.jpg",
        "./img/coding.jpg"
    ];
    
    let index = 0;

    function changeBackground() {
        showcase.style.backgroundImage = `url('${images[index]}')`;
        index = (index + 1) % images.length; // Loop through images
    }

    // Set initial background and start changing every 3 seconds
    changeBackground();
    setInterval(changeBackground, 3000);
});
