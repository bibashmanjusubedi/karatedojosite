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

      // function to fetch and insert dojo data
      function loadDojoData(){
        fetch('https://localhost:7286/api/Dojo')
            .then(response => response.json())
            .then(data =>{
                if(data.length > 0 ){
                    const dojo = data[0];
                    const h1Element = showcase.querySelector('h1');
                    const pElement = showcase.querySelector('p b');
                    if (h1Element) h1Element.textContent = dojo.name;
                    if (pElement) pElement.textContent = dojo.description;
                }
            })
            .catch(error => console.error('Error fetching dojo data:', error));
    }

    // call dojoData
    loadDojoData();

    function serviceTemplate({name, description,pricing}){
        return `
            <li>
                <h3>${name}</h3>
                <p>${description}</p>
                <p>Pricing in NRS: ${pricing}</p>
            </li>    
        `;
    }

    function loadProgramsData(){
        fetch('https://localhost:7286/api/Programs')
        .then(res => res.json())
        .then(programs => {
          document.getElementById('services').innerHTML =
            programs.map(serviceTemplate).join('');
        });
    }

    loadProgramsData();

    function uint8ToBase64(bytes) {
        let binary = '';
        let len = bytes.length;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function boxTemplate({image, name, description, pricing}) {
        return `
          <div class="box">
            <img src="${image}" alt="${name}">
            <h3>${name}</h3>
          </div>
        `;
    }
      
    function loadProgramsBox(){
        fetch('https://localhost:7286/api/Programs')
            .then(res => res.json())
            .then(programs => {
                document.getElementById('boxesContainer').innerHTML =
                programs.map(program => {
                    const imageSrc = Array.isArray(program.image)
                    ? `data:image/jpeg;base64,${uint8ToBase64(program.image)}`
                    : `data:image/jpeg;base64,${program.image}`; // Or URL if available

                    return boxTemplate({
                    ...program,
                    image: imageSrc
                    });
                }).join('');
            });
    }
    
    loadProgramsBox()
    

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