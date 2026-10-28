// Menus déroulants, bouton retour en haut, et mode sombre.
(function () {
  "use strict";

  // ===== Mode sombre =====
  var racine = document.documentElement;

  var ICONE_LUNE =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>';
  var ICONE_SOLEIL =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zm0-5h0v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4l2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

  function stockage(action, valeur) {
    try {
      if (action === "get") return localStorage.getItem("theme");
      if (action === "set") localStorage.setItem("theme", valeur);
      if (action === "del") localStorage.removeItem("theme");
    } catch (e) {
      /* localStorage indisponible : on continue sans mémoriser. */
    }
    return null;
  }

  // Appliquer le choix mémorisé au plus tôt (sinon, le système décide via CSS).
  var choix = stockage("get");
  if (choix === "dark" || choix === "light") {
    racine.setAttribute("data-theme", choix);
  }

  function themeActif() {
    var attr = racine.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function creerBoutonTheme() {
    var header = document.querySelector("header");
    if (!header) return;

    var bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "theme-toggle";

    function rafraichir() {
      var sombre = themeActif() === "dark";
      bouton.innerHTML = sombre ? ICONE_SOLEIL : ICONE_LUNE;
      var label = sombre ? "Passer en mode clair" : "Passer en mode sombre";
      bouton.setAttribute("aria-label", label);
      bouton.setAttribute("title", label);
    }

    bouton.addEventListener("click", function () {
      var nouveau = themeActif() === "dark" ? "light" : "dark";
      racine.setAttribute("data-theme", nouveau);
      stockage("set", nouveau);
      rafraichir();
    });

    rafraichir();
    header.appendChild(bouton);
  }

  creerBoutonTheme();

  // ===== Menu hamburger (regroupe toute la navigation) =====
  function creerHamburger() {
    var header = document.querySelector("header");
    var nav = header && header.querySelector("nav");
    if (!header || !nav) return;

    nav.classList.add("repliable");
    if (!nav.id) nav.id = "menu-principal";

    var bouton = document.createElement("button");
    bouton.type = "button";
    bouton.className = "menu-hamburger";
    bouton.setAttribute("aria-controls", nav.id);
    bouton.setAttribute("aria-expanded", "false");
    bouton.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>' +
      "<span>Menu</span>";

    function definir(ouvert) {
      nav.classList.toggle("ouvert", ouvert);
      bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
    }

    bouton.addEventListener("click", function (e) {
      e.stopPropagation();
      definir(!nav.classList.contains("ouvert"));
    });

    // Refermer en cliquant en dehors de la navigation.
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("ouvert")) return;
      if (e.target.closest("nav") || e.target.closest(".menu-hamburger")) return;
      definir(false);
    });

    // Refermer avec la touche Échap.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") definir(false);
    });

    // Fermer quand on suit un lien (sauf le déclencheur du sous-menu Galerie).
    nav.addEventListener("click", function (e) {
      var lien = e.target.closest("a");
      if (!lien) return;
      if (lien.parentElement && lien.parentElement.classList.contains("deroulant")) {
        return;
      }
      definir(false);
    });

    nav.parentNode.insertBefore(bouton, nav);
  }

  creerHamburger();

  // Vrai sur les appareils sans survol (tactiles) : c'est là qu'on veut le clic.
  var tactile = window.matchMedia("(hover: none)");

  var deroulants = Array.prototype.slice.call(
    document.querySelectorAll(".deroulant")
  );

  function fermerTous(sauf) {
    deroulants.forEach(function (d) {
      if (d !== sauf) {
        d.classList.remove("ouvert");
        var a = d.querySelector(":scope > a");
        if (a) a.setAttribute("aria-expanded", "false");
      }
    });
  }

  deroulants.forEach(function (d) {
    var declencheur = d.querySelector(":scope > a");
    if (!declencheur) return;

    declencheur.setAttribute("aria-haspopup", "true");
    declencheur.setAttribute("aria-expanded", "false");

    declencheur.addEventListener("click", function (e) {
      // Sur desktop (survol dispo), on laisse le lien naviguer normalement.
      if (!tactile.matches) return;

      // Sur tactile : le 1er tap ouvre/ferme le sous-menu au lieu de naviguer.
      e.preventDefault();
      var ouvert = d.classList.toggle("ouvert");
      declencheur.setAttribute("aria-expanded", ouvert ? "true" : "false");
      fermerTous(d);
    });
  });

  // Refermer quand on tape/clique en dehors d'un déroulant.
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".deroulant")) fermerTous(null);
  });

  // Refermer avec la touche Échap.
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") fermerTous(null);
  });

  // Bouton « retour en haut » créé dynamiquement (présent sur toutes les pages).
  var haut = document.createElement("button");
  haut.type = "button";
  haut.className = "retour-haut";
  haut.setAttribute("aria-label", "Retour en haut de la page");
  haut.setAttribute("title", "Retour en haut");
  haut.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8l-6 6 1.4 1.4L12 10.8l4.6 4.6L18 14z"/></svg>';
  document.body.appendChild(haut);

  function majVisibilite() {
    if (window.scrollY > 300) {
      haut.classList.add("visible");
    } else {
      haut.classList.remove("visible");
    }
  }

  haut.addEventListener("click", function () {
    var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduit ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", majVisibilite, { passive: true });
  majVisibilite();
})();
