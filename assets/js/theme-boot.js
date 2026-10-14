/* Aplica el tema antes de pintar para evitar parpadeos. ?tema=bombon|velvet|nacar */
(function () {
  var themes = ["bombon", "velvet", "nacar"];
  var fromUrl = new URLSearchParams(location.search).get("tema");
  var saved = null;
  try { saved = localStorage.getItem("vv-theme"); } catch (e) {}
  var t = themes.indexOf(fromUrl) > -1 ? fromUrl : themes.indexOf(saved) > -1 ? saved : "bombon";
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("vv-theme", t); } catch (e) {}
})();
