// Mobile menu: adds a hamburger button to the nav and toggles the link list.
// The button only shows at <=900px (see mobile.css), where the inline page CSS hides .nav-links.
(function () {
  var nav = document.querySelector('nav');
  var inner = nav && nav.querySelector('.nav-inner');
  var links = nav && nav.querySelector('.nav-links');
  if (!inner || !links) return;

  var btn = document.createElement('button');
  btn.className = 'nav-toggle';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'site-menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  links.id = links.id || 'site-menu';
  inner.appendChild(btn);

  function setOpen(open) {
    nav.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('nav-open'));
  });

  links.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    // "Services" is a label (href="#"), not a destination
    if (a.getAttribute('href') === '#') { e.preventDefault(); return; }
    setOpen(false);
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('nav-open') && !nav.contains(e.target)) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav-open')) { setOpen(false); btn.focus(); }
  });

  var wide = window.matchMedia('(min-width: 901px)');
  if (wide.addEventListener) wide.addEventListener('change', function () { setOpen(false); });
})();
