// ==========================
// Elements
// ==========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const dashboardModal = document.getElementById('dashboardModal');

const heroTitleEl = document.querySelector('#hero h1');
const heroParaEl = document.querySelector('#hero p');
const heroBtns = document.querySelectorAll('#hero button');
const cards = document.querySelectorAll('.card');

// Terms checkbox
const termsCheck = document.getElementById('termsCheck');

// Dashboard elements
const progressCard = document.getElementById('progressCard');
const completedCard = document.getElementById('completedCard');
const nextLessonCard = document.getElementById('nextLessonCard');
const userNotifications = document.getElementById('userNotifications');

// ==========================
// Hamburger Toggle
// ==========================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('show');
});

// ==========================
// Smooth Scroll
// ==========================
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e){
        if(this.getAttribute('href').startsWith("#")){
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            navLinks.classList.remove('show');
            hamburger.classList.remove('active');
        }
    });
});

// ==========================
// Modal Open/Close
// ==========================
const modalTriggers = [
    {btnId: 'loginBtn', modal: loginModal},
    {btnId: 'signupBtn', modal: signupModal},
    {btnId: 'heroLoginBtn', modal: loginModal},
    {btnId: 'heroSignupBtn', modal: signupModal}
];

modalTriggers.forEach(trigger => {
    document.getElementById(trigger.btnId).onclick = () => trigger.modal.style.display = 'block';
});

document.getElementById('loginClose').onclick = () => loginModal.style.display = 'none';
document.getElementById('signupClose').onclick = () => signupModal.style.display = 'none';
document.getElementById('dashboardClose').onclick = () => dashboardModal.style.display = 'none';

window.onclick = (event) => {
    if(event.target === loginModal) loginModal.style.display = 'none';
    if(event.target === signupModal) signupModal.style.display = 'none';
    if(event.target === dashboardModal) dashboardModal.style.display = 'none';
}

// ==========================
// Hero Text Animation
// ==========================
let heroText = heroTitleEl.textContent;
heroTitleEl.textContent = '';
let i = 0;
function typeWriter() {
    if(i < heroText.length){
        heroTitleEl.textContent += heroText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}
typeWriter();

// Hero fade-in
function fadeInUp(el, delay = 0){
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
        el.style.transition = 'all 0.8s ease-out';
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
    }, delay);
}
fadeInUp(heroTitleEl, 200);
fadeInUp(heroParaEl, 600);
heroBtns.forEach((btn, i) => fadeInUp(btn, 1000 + i*200));

// ==========================
// Card Hover Effects
// ==========================
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.05)';
        card.style.boxShadow = '0 0 30px #00caff';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = '0 3px 15px rgba(255,59,63,0.2)';
    });
});

// ==========================
// User State
// ==========================
let users = [];      // Store all signed-up users
let currentUser = null;

// ==========================
// Sign Up
// ==========================
document.getElementById('signupSubmit').addEventListener('click', () => {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const msg = document.getElementById('signupMessage');
    msg.style.display = 'none';

    if(!termsCheck.checked){
        msg.textContent = "You must accept the Terms & Conditions!";
        msg.className = 'message error';
        msg.style.display='block';
        return;
    }

    if(name && email && password){
        if(users.some(u => u.email === email)){
            msg.textContent = "Email already registered!";
            msg.className = 'message error';
            msg.style.display='block';
            return;
        }

        const newUser = {
            name,
            email,
            password,
            progress: 0,
            completedLessons: 0,
            nextLesson: "Lesson 1",
            notifications: ["Welcome to Pro's-ED Tech!"]
        };
        users.push(newUser);
        currentUser = newUser;

        msg.textContent = "Sign up successful!";
        msg.className = 'message success';
        msg.style.display='block';
        signupModal.style.display = 'none';
        updateNavbar();
        showDashboard();
    } else {
        msg.textContent = "Please fill all fields!";
        msg.className = 'message error';
        msg.style.display='block';
    }
});

// ==========================
// Login
// ==========================
document.getElementById('loginSubmit').addEventListener('click', () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const msg = document.getElementById('loginMessage');
    msg.style.display = 'none';

    if(email && password){
        const user = users.find(u => u.email === email && u.password === password);
        if(user){
            currentUser = user;
            msg.textContent = "Login successful!";
            msg.className = 'message success';
            msg.style.display='block';
            loginModal.style.display = 'none';
            updateNavbar();
            showDashboard();
        } else {
            msg.textContent = "Invalid email or password!";
            msg.className = 'message error';
            msg.style.display='block';
        }
    } else {
        msg.textContent = "Please enter email and password!";
        msg.className = 'message error';
        msg.style.display='block';
    }
});

// ==========================
// Update Navbar for Logged-In User
// ==========================
function updateNavbar(){
    const loginLink = document.getElementById('loginBtn');
    const signupLink = document.getElementById('signupBtn');
    if(currentUser){
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';

        if(!document.getElementById('dashboardNav')){
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" id="dashboardNav">Dashboard</a>`;
            navLinks.insertBefore(li, navLinks.firstChild);
            document.getElementById('dashboardNav').onclick = () => showDashboard();
        }
    }
}

// ==========================
// Show Dashboard
// ==========================
function showDashboard(){
    if(currentUser){
        document.getElementById('dashName').textContent = 'Name: ' + currentUser.name;
        document.getElementById('dashEmail').textContent = 'Email: ' + currentUser.email;

        // Update progress
        progressCard.textContent = `Progress: ${currentUser.progress}%`;
        completedCard.textContent = `Completed Lessons: ${currentUser.completedLessons}`;
        nextLessonCard.textContent = `Next Lesson: ${currentUser.nextLesson}`;

        // Show notifications
        userNotifications.innerHTML = "";
        currentUser.notifications.forEach(note => {
            const p = document.createElement('p');
            p.textContent = note;
            userNotifications.appendChild(p);
        });

        dashboardModal.style.display = 'block';
    }
}
