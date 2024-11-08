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
    window.location.href = 'index.html';  // Remplacer par votre page principale
  } else {
    alert('Identifiants incorrects.');
  }
});