// Hero Carousel - Enhanced 5-slide version
(function(){
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const nextBtn = document.querySelector('.hero-next');
  const prevBtn = document.querySelector('.hero-prev');
  const dots = document.querySelector('.hero-dots');
  let idx = 0;

  // 设置背景图（懒加载）
  function setBg(slide){
    if(slide.dataset.bg && !slide.style.backgroundImage){
      slide.style.backgroundImage = `url(${slide.dataset.bg})`;
    }
  }

  // 显示指定的 slide
  function show(i){
    slides[idx].classList.remove('is-active');
    slides[idx].setAttribute('aria-hidden','true');

    idx = (i + slides.length) % slides.length;
    setBg(slides[idx]);
    slides[idx].classList.add('is-active');
    slides[idx].setAttribute('aria-hidden','false');

    updateDots();
  }

  // 下一张 / 上一张
  function next(){ show(idx+1); }
  function prev(){ show(idx-1); }

  // 绑定按钮事件
  if(nextBtn) nextBtn.addEventListener('click', next);
  if(prevBtn) prevBtn.addEventListener('click', prev);

  // 自动播放（6秒切换一次）
  let timer = setInterval(next, 6000);

  // 鼠标悬停时暂停，移开后继续
  const heroInner = document.querySelector('.hero-inner');
  if(heroInner){
    heroInner.addEventListener('mouseenter', () => clearInterval(timer));
    heroInner.addEventListener('mouseleave', () => timer = setInterval(next, 6000));
  }

  // 构建底部指示点
  if(dots){
    slides.forEach((s, i) => {
      const d = document.createElement('button');
      d.className = 'dot';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', () => show(i));
      dots.appendChild(d);
    });
  }

  // 更新指示点状态
  function updateDots(){
    if(!dots) return;
    dots.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  // 初始化
  if(slides.length > 0){
    setBg(slides[idx]);
    slides[idx].classList.add('is-active');
    slides[idx].setAttribute('aria-hidden','false');
    updateDots();
  }
})();