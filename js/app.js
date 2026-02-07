(function(){
  // Smooth scroll for anchors
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a[href^="#"]');
    if(!a) return;
    const hash = a.getAttribute('href');
    if(!hash || hash === '#') return;
    const el = document.querySelector(hash);
    if(el){
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // -------- Topic browser (Lesson 1) --------
  function esc(s){
    return String(s).replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function uniq(arr){
    return Array.from(new Set(arr));
  }

  function getFilterState(){
    const q = (document.querySelector('#topicSearch')?.value || '').trim().toLowerCase();
    const cluster = document.querySelector('#topicCluster')?.value || 'all';
    const fsi = document.querySelector('#topicFSI')?.value || 'all';
    return { q, cluster, fsi };
  }

  function matchesTopic(t, f){
    if(f.cluster !== 'all' && t.cluster !== f.cluster) return false;
    if(f.fsi !== 'all' && !t.fsi.includes(f.fsi)) return false;
    if(!f.q) return true;
    const hay = [t.title, t.short, t.cluster, t.fsi, ...(t.keywords||[])].join(' ').toLowerCase();
    return hay.includes(f.q);
  }

  function renderTopics(){
    const container = document.querySelector('#topicsGrid');
    if(!container || !window.TOPICS) return;

    // Populate dropdowns once
    const clusterSel = document.querySelector('#topicCluster');
    const fsiSel = document.querySelector('#topicFSI');

    if(clusterSel && clusterSel.options.length <= 1){
      uniq(window.TOPICS.map(t=>t.cluster)).sort().forEach(c=>{
        const o=document.createElement('option');
        o.value=c; o.textContent=c;
        clusterSel.appendChild(o);
      });
    }
    if(fsiSel && fsiSel.options.length <= 1){
      ['Н1','Н2','Н3','Н4','Н5','Н6'].forEach(n=>{
        const o=document.createElement('option');
        o.value=n; o.textContent=n;
        fsiSel.appendChild(o);
      });
    }

    const f = getFilterState();
    const list = window.TOPICS.filter(t=>matchesTopic(t,f));

    container.innerHTML = list.map(t=>{
      return `
        <div class="glass-card p-5 rounded-2xl border border-slate-700/60 bg-slate-900/40 hover:bg-slate-900/60 transition">
          <div class="flex items-start justify-between gap-3">
            <div>
              <div class="text-xs text-slate-300/90">${esc(t.cluster)}</div>
              <div class="text-lg font-semibold mt-1">${esc(t.title)}</div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs border border-emerald-400/60 bg-emerald-500/10 text-emerald-100 whitespace-nowrap">${esc(t.fsi)}</span>
          </div>
          <p class="text-sm text-slate-200/80 mt-3">${esc(t.short)}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            ${(t.keywords||[]).slice(0,4).map(k=>`<span class="px-2 py-1 text-xs rounded-full border border-slate-600/70 text-slate-200/80">${esc(k)}</span>`).join('')}
          </div>
          <div class="mt-4 flex gap-3">
            <button class="btn-ghost" data-pick-topic="${esc(t.id)}">Выбрать</button>
            <a class="btn-primary" href="lessons/lesson1.html#card" title="Открыть шаблон карточки">Что сдать</a>
          </div>
        </div>`;
    }).join('');

    const pickedId = localStorage.getItem('pickedTopicId');
    if(pickedId){
      const picked = window.TOPICS.find(t=>t.id===pickedId);
      const box = document.querySelector('#pickedTopicBox');
      if(box && picked){
        box.classList.remove('hidden');
        box.querySelector('[data-picked-title]').textContent = picked.title;
        box.querySelector('[data-picked-meta]').textContent = `${picked.cluster} • ${picked.fsi}`;
      }
    }
  }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-pick-topic]');
    if(!btn) return;
    const id = btn.getAttribute('data-pick-topic');
    localStorage.setItem('pickedTopicId', id);
    renderTopics();
    const box = document.querySelector('#pickedTopicBox');
    if(box){
      box.scrollIntoView({behavior:'smooth', block:'center'});
    }
  });

  ['#topicSearch','#topicCluster','#topicFSI'].forEach(sel=>{
    const el = document.querySelector(sel);
    if(!el) return;
    el.addEventListener('input', ()=>renderTopics());
    el.addEventListener('change', ()=>renderTopics());
  });

  // -------- Progress checklist (per lesson) --------
  function initLessonChecklist(){
    const root = document.querySelector('[data-lesson-id]');
    if(!root) return;
    const lessonId = root.getAttribute('data-lesson-id');
    const items = Array.from(document.querySelectorAll('[data-check-item]'));
    if(items.length===0) return;

    const key = `lesson_${lessonId}_checks`;
    const state = JSON.parse(localStorage.getItem(key) || '{}');

    items.forEach((input)=>{
      const id = input.getAttribute('data-check-item');
      if(state[id] === true) input.checked = true;
      input.addEventListener('change', ()=>{
        state[id] = input.checked;
        localStorage.setItem(key, JSON.stringify(state));
        updateBadge();
      });
    });

    function updateBadge(){
      const done = items.filter(i=>i.checked).length;
      const badge = document.querySelector('#progressBadge');
      if(badge){
        badge.textContent = `Прогресс: ${done}/${items.length}`;
      }
    }
    updateBadge();
  }

  // Init on load
  document.addEventListener('DOMContentLoaded', ()=>{
    renderTopics();
    initLessonChecklist();
  });
})();
