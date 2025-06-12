let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const indicators = document.querySelectorAll('.carousel-indicator');
const totalSlides = slides.length;

function updateCarousel() {
    const carousel = document.getElementById('heroCarousel');
    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    indicators.forEach((indicator, index) => {
        if (index === currentSlide) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}


let slideInterval = setInterval(nextSlide, 5000);


const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

let users = JSON.parse(localStorage.getItem('amazonCloneUsers')) || [];

function showLoginModal() {
    document.getElementById('loginModal').classList.remove('hidden');
    document.getElementById('signupModal').classList.add('hidden');
    closeMobileMenu();
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.add('hidden');
}

function showSignupModal() {
    document.getElementById('signupModal').classList.remove('hidden');
    document.getElementById('loginModal').classList.add('hidden');
    closeMobileMenu();
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.add('hidden');
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('amazonCloneCurrentUser', JSON.stringify(user));
        updateUserUI(user.name);
        closeLoginModal();
        alert('Login successful!');
    } else {
        alert('Invalid email or password');
    }
}

function signup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const mobile = document.getElementById('signupMobile').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
    
    if (!name || !email || !mobile || !password || !passwordConfirm) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== passwordConfirm) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    const newUser = {
        name,
        email,
        mobile,
        password
    };
    
    users.push(newUser);
    localStorage.setItem('amazonCloneUsers', JSON.stringify(users));
    localStorage.setItem('amazonCloneCurrentUser', JSON.stringify(newUser));
    
    updateUserUI(name);
    closeSignupModal();
    alert('Account created successfully!');
}

function logout() {
    localStorage.removeItem('amazonCloneCurrentUser');
    updateUserUI();
    alert('Logged out successfully');
}

function updateUserUI(name = null) {
    const userGreeting = document.getElementById('userGreeting');
    const mobileUserGreeting = document.getElementById('mobileUserGreeting');
    
    if (name) {
        userGreeting.textContent = `Hello, ${name}`;
        if (mobileUserGreeting) mobileUserGreeting.textContent = `Hello, ${name}`;
        
        const tooltipContent = document.querySelector('.nav-tooltip .nav-tooltip-content');
        if (tooltipContent) {
            tooltipContent.innerHTML = `
                <div class="mb-4">
                    <button onclick="logout()" class="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded text-sm font-medium">
                        Sign out
                    </button>
                </div>
                <div>
                    <p class="text-sm">Your Account</p>
                    <ul class="mt-2 text-sm">
                        <li><a href="#" class="text-blue-500 hover:underline">Your Orders</a></li>
                        <li><a href="#" class="text-blue-500 hover:underline">Your Wish List</a></li>
                        <li><a href="#" class="text-blue-500 hover:underline">Your Recommendations</a></li>
                    </ul>
                </div>
            `;
        }
    } else {
        userGreeting.textContent = 'Hello, Sign in';
        if (mobileUserGreeting) mobileUserGreeting.textContent = 'Hello, Sign in';
    
        const tooltipContent = document.querySelector('.nav-tooltip .nav-tooltip-content');
        if (tooltipContent) {
            tooltipContent.innerHTML = `
                <div class="mb-4" id="authButtons">
                    <button onclick="showLoginModal()" class="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded text-sm font-medium">
                        Sign in
                    </button>
                </div>
                <div>
                    <p class="text-sm"><span class="font-bold">New customer?</span> <a href="#" class="text-blue-500 hover:underline" onclick="showSignupModal()">Start here.</a></p>
                </div>
            `;
        }
    }
}

// Mobile menu 
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('show');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('show');
}

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu 
    document.addEventListener('click', (e) => {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        if (mobileMenu && !mobileMenu.contains(e.target) && 
            e.target !== mobileMenuButton && 
            !mobileMenuButton.contains(e.target)) {
            closeMobileMenu();
        }
    });
}


function initializePage() {
    const currentUser = JSON.parse(localStorage.getItem('amazonCloneCurrentUser'));
    if (currentUser) {
        updateUserUI(currentUser.name);
    }

    const accountTooltip = document.querySelector('.nav-tooltip');
    if (accountTooltip) {
        accountTooltip.addEventListener('click', function(e) {
            if (!localStorage.getItem('amazonCloneCurrentUser')) {
                e.preventDefault();
                showLoginModal();
            }
        });
    }

    // Add event listeners for modal buttons
    document.querySelectorAll('[onclick="showLoginModal()"]').forEach(button => {
        button.addEventListener('click', showLoginModal);
    });

    document.querySelectorAll('[onclick="showSignupModal()"]').forEach(button => {
        button.addEventListener('click', showSignupModal);
    });

    document.querySelectorAll('[onclick="closeLoginModal()"]').forEach(button => {
        button.addEventListener('click', closeLoginModal);
    });

    document.querySelectorAll('[onclick="closeSignupModal()"]').forEach(button => {
        button.addEventListener('click', closeSignupModal);
    });

    document.querySelectorAll('[onclick="login()"]').forEach(button => {
        button.addEventListener('click', login);
    });

    document.querySelectorAll('[onclick="signup()"]').forEach(button => {
        button.addEventListener('click', signup);
    });

    document.querySelectorAll('[onclick="logout()"]').forEach(button => {
        button.addEventListener('click', logout);
    });

    document.querySelectorAll('[onclick="prevSlide()"]').forEach(button => {
        button.addEventListener('click', prevSlide);
    });

    document.querySelectorAll('[onclick="nextSlide()"]').forEach(button => {
        button.addEventListener('click', nextSlide);
    });

    document.querySelectorAll('[onclick^="goToSlide("]').forEach(button => {
        const index = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
        button.addEventListener('click', () => goToSlide(index));
    });

  
    initMobileMenu();
}

document.addEventListener('DOMContentLoaded', initializePage);  
