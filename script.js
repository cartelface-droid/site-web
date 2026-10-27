// Menus déroulants : survol sur desktop, clic/tap sur mobile (écrans tactiles).
(function () {
  "use strict";

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
