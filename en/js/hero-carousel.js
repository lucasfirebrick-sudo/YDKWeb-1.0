// Hero Carousel - Enhanced 5-slide version
(function(){
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const nextBtn = document.querySelector('.hero-next');
  const prevBtn = document.querySelector('.hero-prev');
  const dots = document.querySelector('.hero-dots');
  let idx = 0;

  // Set background image (lazy loading)
  function setBg(slide){
    if(slide.dataset.bg && !slide.style.backgroundImage){
      slide.style.backgroundImage = `url(${slide.dataset.bg})`;
    }
  }

  // Show specified slide
  function show(i){
    slides[idx].classList.remove('is-active');
    slides[idx].setAttribute('aria-hidden','true');

    idx = (i + slides.length) % slides.length;
    setBg(slides[idx]);
    slides[idx].classList.add('is-active');
    slides[idx].setAttribute('aria-hidden','false');

    updateDots();
  }

  // Next / Previous
  function next(){ show(idx+1); }
  function prev(){ show(idx-1); }

  // Bind button events
  if(nextBtn) nextBtn.addEventListener('click', next);
  if(prevBtn) prevBtn.addEventListener('click', prev);

  // Auto play (switch every 6 seconds)
  let timer = setInterval(next, 6000);

  // Pause on mouse hover, continue when moved away
  const heroInner = document.querySelector('.hero-inner');
  if(heroInner){
    heroInner.addEventListener('mouseenter', () => clearInterval(timer));
    heroInner.addEventListener('mouseleave', () => timer = setInterval(next, 6000));
  }

  // Build bottom indicator dots
  if(dots){
    slides.forEach((s, i) => {
      const d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => show(i));
      dots.appendChild(d);
    });
  }

  // Update indicator dot status
  function updateDots(){
    if(!dots) return;
    dots.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  // Initialize
  if(slides.length > 0){
    setBg(slides[idx]);
    slides[idx].classList.add('is-active');
    slides[idx].setAttribute('aria-hidden','false');
    updateDots();
  }
})();