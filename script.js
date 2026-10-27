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
})();
