// -------------------------------------------------page index---------------------------------------
// const text = document.querySelector("#info");
// const btnb = document.querySelector("#btnb");
// const qrImage = document.querySelector("#qr-img");

// btnb.addEventListener('click' , () => {
//     const infoValue = info.value;
//     console.log(infoValue);
//     if(!infoValue){
//         alert('Vous devez entrez une information! ')
//         qrImage.style.display = 'none';      
//     }
//     else{
//         const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${infoValue}`;
//         qrImage.src = url;
//         qrImage.style.display = 'block';
//         qrImage.style.margin = 'auto';
//     }
// })

const info = document.querySelector("#info");
const btnb = document.querySelector("#btnb");
const qrImage = document.querySelector("#qr-img");
const qrCodeHistory = []; // Tableau pour stocker les URLs des QR codes générés

// Fonction pour mettre à jour l'affichage de l'historique des QR codes
function updateQrCodeHistoryDisplay() {
    const historyContainer = document.getElementById("qrCodeHistory");
    historyContainer.innerHTML = ""; // Vider l'affichage de l'historique

    qrCodeHistory.forEach((url, index) => {
        const img = document.createElement("img");
        img.src = url;
        img.alt = `QR Code ${index + 1}`;
        historyContainer.appendChild(img);
    });
}

// Fonction pour générer le QR code et l'ajouter à l'historique
btnb.addEventListener('click', () => {
    const infoValue = info.value;
    if (!infoValue) {
        alert('Vous devez entrer une information!');
        qrImage.style.display = 'none';
    } else {
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${infoValue}`;
        qrImage.src = url;
        qrImage.style.display = 'block';
        qrImage.style.margin = 'auto';

        // Ajouter le QR code généré dans l'historique et mettre à jour l'affichage
        qrCodeHistory.push(url);
        updateQrCodeHistoryDisplay();
    }
});

// Fonction pour afficher/masquer l'historique des QR codes
document.getElementById("toggleHistoryButton").addEventListener("click", () => {
    const historyContainer = document.getElementById("qrCodeHistoryContainer");
    if (historyContainer.style.display === "none") {
        historyContainer.style.display = "block";
        document.getElementById("toggleHistoryButton").textContent = "Masquer l'historique des QR codes";
    } else {
        historyContainer.style.display = "none";
        document.getElementById("toggleHistoryButton").textContent = "Voir l'ensemble des QR codes générés";
    }
});



// ---------------------------------lecture---------------------------------------

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const resultText = document.getElementById("result");
const fileInput = document.getElementById("fileInput");
const activateCameraButton = document.getElementById("activateCameraButton");

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.hidden = false; // Afficher la vidéo
        video.play();
        requestAnimationFrame(scanQRCode);
    } catch (error) {
        console.error("Erreur lors de l'accès à la caméra :", error);
        resultText.textContent = "Erreur lors de l'accès à la caméra";
    }
}

function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            resultText.textContent = `Résultat : ${code.data}`;
            return;
        }
    }
    requestAnimationFrame(scanQRCode);
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                resultText.textContent = `Résultat : ${code.data}`;
            } else {
                resultText.textContent = "Aucun QR code détecté dans l'image";
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Activer la caméra uniquement lorsque l'utilisateur clique sur le bouton
activateCameraButton.addEventListener("click", () => {
    startCamera();
    activateCameraButton.hidden = true; // Cacher le bouton après activation
});

fileInput.addEventListener("change", handleImageUpload);
