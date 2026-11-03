(function () {
  "use strict";

  const header = document.querySelector("header");
  const navigation = document.querySelector("#primary-navigation");
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  if (!header || !navigation || !menuToggle) {
    return;
  }

  const dropdowns = [...navigation.querySelectorAll(".nav-dropdown")];
  const desktopBreakpoint = window.matchMedia("(min-width: 1024px)");

  function setDropdownOpen(dropdown, isOpen) {
    const trigger = dropdown.querySelector("[aria-controls]");
    const panel = dropdown.querySelector(".nav-dropdown-panel");

    if (!trigger || !panel) {
      return;
    }

    dropdown.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.setAttribute("aria-hidden", String(!isOpen));
  }

  function closeDropdowns(except) {
    dropdowns.forEach((dropdown) => {
      if (dropdown !== except) {
        delete dropdown.dataset.hoverOpened;
        setDropdownOpen(dropdown, false);
      }
    });
  }

  function setMobileMenuOpen(isOpen) {
    navigation.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
    );
    menuToggle.querySelector(".material-symbols-outlined").textContent = isOpen
      ? "close"
      : "menu";

    if (!isOpen) {
      closeDropdowns();
    }
  }

  function closeNavigation({ restoreFocus = false } = {}) {
    setMobileMenuOpen(false);
    closeDropdowns();

    if (restoreFocus) {
      menuToggle.focus();
    }
  }

  menuToggle.addEventListener("click", () => {
    setMobileMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector("button[aria-controls]");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", () => {
      if (dropdown.dataset.hoverOpened === "true") {
        delete dropdown.dataset.hoverOpened;
        return;
      }

      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      closeDropdowns(dropdown);
      setDropdownOpen(dropdown, !isOpen);
    });

    dropdown.addEventListener("pointerenter", (event) => {
      if (!desktopBreakpoint.matches || event.pointerType !== "mouse") {
        return;
      }

      closeDropdowns(dropdown);
      dropdown.dataset.hoverOpened = "true";
      setDropdownOpen(dropdown, true);
    });

    dropdown.addEventListener("pointerleave", (event) => {
      if (!desktopBreakpoint.matches || event.pointerType !== "mouse") {
        return;
      }

      delete dropdown.dataset.hoverOpened;
      setDropdownOpen(dropdown, false);
    });
  });

  navigation.addEventListener("click", (event) => {
    const anchor = event.target.closest('a[href^="#"]:not([aria-disabled="true"])');

    if (anchor) {
      closeNavigation();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    const openDropdown = dropdowns.find((dropdown) =>
      dropdown.classList.contains("is-open")
    );
    const mobileMenuOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (!openDropdown && !mobileMenuOpen) {
      return;
    }

    event.preventDefault();
    closeNavigation();
    (mobileMenuOpen ? menuToggle : openDropdown.querySelector("button")).focus();
  });

  desktopBreakpoint.addEventListener("change", (event) => {
    closeNavigation();

    if (event.matches) {
      navigation.classList.remove("is-open");
    }
  });
})();
