// Desktop navigation
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    
    // Close all submenus when closing main menu
    if (!isOpen) {
      document.querySelectorAll(".nav-item.is-open").forEach((item) => {
        item.classList.remove("is-open");
      });
      document.querySelectorAll("[data-submenu-toggle]").forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
      });
    }
    
    // Prevent body scroll when menu is open on mobile
    if (window.innerWidth <= 960) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }
  });
}

document.querySelectorAll("[data-submenu-toggle]").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const item = toggle.closest(".nav-item");
    if (!item) return;
    
    const isOpen = item.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    
    // Close other submenus at the same level
    if (isOpen) {
      const parent = item.parentElement;
      if (parent) {
        parent.querySelectorAll(".nav-item.is-open").forEach((sibling) => {
          if (sibling !== item) {
            sibling.classList.remove("is-open");
            const siblingToggle = sibling.querySelector("[data-submenu-toggle]");
            if (siblingToggle) {
              siblingToggle.setAttribute("aria-expanded", "false");
            }
          }
        });
      }
    }
  });
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (nav && nav.classList.contains("is-open")) {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      
      // Close all submenus
      document.querySelectorAll(".nav-item.is-open").forEach((item) => {
        item.classList.remove("is-open");
      });
      document.querySelectorAll("[data-submenu-toggle]").forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
      });
    }
  }
});

// Mobile bottom navigation
const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const mobileMenuContent = document.getElementById("mobile-menu-content");

// Function to render mobile menu
function renderMobileMenu() {
  if (!mobileMenuContent) return;
  
  const siteNav = document.querySelector("#site-nav");
  if (!siteNav) return;
  
  let mobileHTML = '';
  
  // Get all menu items and convert to mobile format
  const menuItems = siteNav.querySelectorAll('.nav-item, .site-nav > a');
  
  menuItems.forEach(item => {
    const isNavItem = item.classList.contains('nav-item');
    const hasSubmenu = isNavItem && item.classList.contains('has-submenu');
    const title = isNavItem ? item.querySelector('.nav-title')?.textContent : item.textContent;
    const url = isNavItem ? '#' : item.getAttribute('href');
    const isActive = item.classList.contains('nav-highlight') || item.querySelector('.nav-highlight');
    
    if (hasSubmenu) {
      mobileHTML += `
        <div class="mobile-nav-group">
          <div class="mobile-nav-group-title">${title}</div>
          <div class="mobile-submenu">
      `;
      
      const submenuLinks = item.querySelectorAll('.submenu a');
      submenuLinks.forEach(link => {
        const linkText = link.textContent;
        const linkUrl = link.getAttribute('href');
        const linkActive = link.classList.contains('nav-highlight');
        mobileHTML += `
          <a href="${linkUrl}" class="mobile-nav-link ${linkActive ? 'active' : ''}">${linkText}</a>
        `;
      });
      
      mobileHTML += `
          </div>
        </div>
      `;
    } else if (!isNavItem || title) {
      mobileHTML += `
        <a href="${url}" class="mobile-nav-link ${isActive ? 'active' : ''}">${title}</a>
      `;
    }
  });
  
  mobileMenuContent.innerHTML = mobileHTML;
}

// Mobile menu toggle
if (mobileMenuToggle && mobileMenuOverlay) {
  mobileMenuToggle.addEventListener("click", () => {
    renderMobileMenu();
    mobileMenuOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  });
}

// Close mobile menu
if (mobileMenuClose && mobileMenuOverlay) {
  mobileMenuClose.addEventListener("click", () => {
    mobileMenuOverlay.classList.remove("is-open");
    document.body.style.overflow = "";
  });
}

// Close mobile menu when clicking overlay
if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener("click", (e) => {
    if (e.target === mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
}

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 960) {
    document.body.style.overflow = "";
    if (nav) nav.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove("is-open");
  }
});
