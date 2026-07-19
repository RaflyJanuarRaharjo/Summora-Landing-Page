// Wrap the statement paragraph into word/emoji spans (text itself is untouched)
  const statementText = document.querySelector('.statement-text');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let statementWords = [];

  if(statementText){
    const originalText = statementText.textContent;
    const emojiSplit = /(\p{Extended_Pictographic}\uFE0F?)/gu;
    const tokens = originalText.split(/(\s+)/); // keep whitespace tokens to preserve spacing
    const frag = document.createDocumentFragment();

    tokens.forEach(token=>{
      if(/^\s+$/.test(token) || token === ''){
        if(token) frag.appendChild(document.createTextNode(token));
        return;
      }
      const parts = token.split(emojiSplit).filter(p=>p !== '');
      parts.forEach(part=>{
        const span = document.createElement('span');
        if(emojiSplit.test(part)){
          span.className = 'emoji';
        } else {
          span.className = 'word';
        }
        emojiSplit.lastIndex = 0;
        span.textContent = part;
        frag.appendChild(span);
        if(span.className === 'word') statementWords.push(span);
      });
    });

    statementText.innerHTML = '';
    statementText.appendChild(frag);
  }

  if(statementText && statementWords.length && !prefersReducedMotion){
    let ticking = false;
    function updateStatementReveal(){
      const rect = statementText.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.88;
      const total = vh * 0.55 + rect.height;
      let progress = (start - rect.top) / total;
      progress = Math.min(1, Math.max(0, progress));
      const revealCount = Math.round(progress * statementWords.length);
      statementWords.forEach((w, i)=>{
        w.classList.toggle('revealed', i < revealCount);
      });
      ticking = false;
    }
    function onScroll(){
      if(!ticking){
        window.requestAnimationFrame(updateStatementReveal);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', updateStatementReveal);
    updateStatementReveal();
  } else if(statementWords.length){
    statementWords.forEach(w=>w.classList.add('revealed'));
  }

  document.querySelectorAll('.faq-item .faq-q').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o=>{
        o.classList.remove('open');
        const a = o.querySelector('.faq-a');
        if(a) a.style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        if(answer) answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // Mobile nav toggle (shows links + Sign In/Start Demo together as one dropdown)
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  navToggle.addEventListener('click', ()=>{
    navMenu.classList.toggle('open');
  });
  navMenu.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click', ()=> navMenu.classList.remove('open'));
  });

  // Testimonial carousel
  const testimonials = [
    {quote:'<span class="hl">Summora turned our chaotic follow-ups</span> into a five-minute review. <span class="hl">We finally trust that nothing slips through the cracks.</span>', name:'Amara Devlin', title:'Head of Operations, Fieldnote', photo:'assets/img/avatar-testimonial-default.webp'},
    {quote:'<span class="hl">We stopped taking notes altogether.</span> Summora catches the decision <span class="hl">the moment someone says it out loud.</span>', name:'Malik Osei', title:'Engineering Lead, Orbital', photo:'assets/img/avatar-malik-osei.webp'},
    {quote:'Onboarding new hires used to mean re-explaining old decisions. <span class="hl">Now they just search Summora.</span>', name:'Priya Nair', title:'Co-founder, Basecamp Co', photo:'assets/img/avatar-priya-nair.webp'}
  ];
  let testiIndex = 0;
  function shiftTestimonial(dir){
    testiIndex = (testiIndex + dir + testimonials.length) % testimonials.length;
    const t = testimonials[testiIndex];
    document.getElementById('testiQuote').innerHTML = t.quote;
    document.getElementById('testiAuthor').innerHTML = `<strong>${t.name}</strong><span>${t.title}</span>`;
    const avatarEl = document.getElementById('testiAvatar');
    if(avatarEl && t.photo){
      avatarEl.style.backgroundImage = `url(${t.photo})`;
    }
  }
  // Scroll-reveal animation for cards and section headers
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach((entry, i)=>{
        if(entry.isIntersecting){
          entry.target.style.transitionDelay = (i % 4) * 90 + 'ms';
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.15, rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(el=>revealObserver.observe(el));
  } else {
    revealEls.forEach(el=>el.classList.add('visible'));
  }
