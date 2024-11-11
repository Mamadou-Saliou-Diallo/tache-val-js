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



// ---------------------------contact---------------------------------------

document.addEventListener("DOMContentLoaded", function() {
    // Récupération du formulaire
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');

    // Validation et soumission du formulaire
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire

        // Validation du formulaire (simple exemple)
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        let isValid = true;

        // Validation du nom
        if (name === "") {
            isValid = false;
            document.getElementById('name').classList.add('is-invalid');
        } else {
            document.getElementById('name').classList.remove('is-invalid');
        }

        // Validation de l'email
        if (email === "" || !validateEmail(email)) {
            isValid = false;
            document.getElementById('email').classList.add('is-invalid');
        } else {
            document.getElementById('email').classList.remove('is-invalid');
        }

        // Validation du message
        if (message === "") {
            isValid = false;
            document.getElementById('message').classList.add('is-invalid');
        } else {
            document.getElementById('message').classList.remove('is-invalid');
        }

        // Si tout est valide
        if (isValid) {
            // Affiche le message de succès
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';

            // Vous pouvez envoyer les données par AJAX ou autre ici

            // Réinitialiser le formulaire
            form.reset();
        } else {
            // Affiche le message d'erreur
            successMessage.style.display = 'none';
            errorMessage.style.display = 'block';
        }
    });

    // Fonction de validation d'email simple
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }
});

// -------------------------connexion--------------------------------

// -------------------------------connexion------------------------------

// Sélection des éléments du DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const toRegisterLink = document.getElementById('to-register');
const toLoginLink = document.getElementById('to-login');

// Écouter le clic sur le lien pour afficher le formulaire d'inscription
toRegisterLink.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  document.getElementById('form-title').innerText = 'Inscription';
});

// Écouter le clic sur le lien pour afficher le formulaire de connexion
toLoginLink.addEventListener('click', () => {
  registerForm.style.display = 'none';
  loginForm.style.display = 'block';
  document.getElementById('form-title').innerText = 'Connexion';
});

// Gestion de l'inscription
document.getElementById('register').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const fullName = document.getElementById('full-name').value;
  const email = document.getElementById('email-register').value;
  const password = document.getElementById('password-register').value;

  // Vérification si l'utilisateur est déjà inscrit
  if (localStorage.getItem(email)) {
    alert('Cet email est déjà utilisé.');
  } else {
    const user = {
      fullName,
      email,
      password
    };
    localStorage.setItem(email, JSON.stringify(user));
    alert('Inscription réussie!');
    // Réinitialisation du formulaire
    registerForm.reset();
    toLoginLink.click();
  }
});

// Gestion de la connexion
document.getElementById('login').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;
  
  const storedUser = JSON.parse(localStorage.getItem(email));

  if (storedUser && storedUser.password === password) {
    alert(`Bienvenue ${storedUser.fullName}!`);
    // Rediriger vers la page principale ou l'application
    window.location.href = 'home.html';  // Remplacer par votre page principale
  } else {
    alert('Identifiants incorrects.');
  }
});


