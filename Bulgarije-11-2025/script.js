// script lib



function dayDifference(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Normalize both dates to remove time portion
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffTime = d1 - d2; // difference in milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}function renderTitle() {
    const dag = "08/11/2025";
    const [dayStr, monthStr, yearStr] = dag.split('/');
    const vertrekDatum = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));

    const filename = window.location.pathname.split("/").pop(); 
    let dayNumMatch = filename.match(/-?\d+/);
    let dayNum = dayNumMatch ? Number(dayNumMatch[0]) : 1;

    const huidigeDatum = new Date(vertrekDatum);
    huidigeDatum.setDate(vertrekDatum.getDate() + (dayNum - 1));

    const monthsNL = ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
    const daysNL = ["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"];
    const formattedDate = `${daysNL[huidigeDatum.getDay()]} ${huidigeDatum.getDate()} ${monthsNL[huidigeDatum.getMonth()]} ${huidigeDatum.getFullYear()}`;

    const titleText = `Bulgarije 📅 ${formattedDate}`;
    document.title = titleText;

    const h1 = document.createElement("h1");
    h1.innerText = titleText;
    document.body.appendChild(h1);

    // --- Build buttons with existence check ---
    const prevLink = `dag${dayNum - 1}.html`;
    const nextLink = `dag${dayNum + 1}.html`;

    const div = document.createElement("div");
    div.className = "top-buttons-container";
    document.body.appendChild(div);

    function createButton(text, url) {
        const a = document.createElement("a");
        a.className = "top-button";
        a.innerText = text;

        // Check if URL exists
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    a.href = url;
                } else {
                    a.href = "index.html"; // redirect to index if file doesn't exist
                }
            })
            .catch(() => { 
                a.href = "index.html"; 
            });

        div.appendChild(a);
    }

    createButton("Terug naar de agenda", "index.html");
    createButton("Vorige dag", prevLink);
    createButton("Volgende dag", nextLink);
}

  function renderAgenda() 
  {
  let containerEl=document.createElement("div");
    document.body.appendChild(containerEl)
  const ul = document.createElement('ul');
  ul.className = 'agenda';

  agenda.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="time">${entry.time}</span>${entry.message}`;
    ul.appendChild(li);
  });

  // Clear previous content and append
  containerEl.innerHTML = '';
  containerEl.appendChild(ul);
}
function renderGallery()
  {
      let gal=document.createElement("div");
    gal.id="gallery";
    document.body.appendChild(gal);
      let nr=document.createElement("small");
    nr.innerText="Media items: "+items.length;
    document.body.appendChild(nr);
    //console.log(nr);

  /* ---------- Set background image if flagged ---------- */
  const bgItem = items.find(i => i.setAsBackground && i.kind === 'image');
  if (bgItem) {
    document.body.style.backgroundImage = `url(${photoPath + bgItem.url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }

  }
  function renderModal() {
  // Check if modal already exists
  if (document.getElementById('modal')) return;

  const modalHTML = `
    <div id="modal" class="modal" aria-hidden="true">
      <div class="modal-content" id="modalContent">
        <span id="closeBtn" class="close-btn" title="Close">&times;</span>
        <div id="modal-media"></div>
        <div class="controls">
          <button id="prevBtn" class="control-btn" title="Previous">❮ vorige beeld</button>
          <button id="rotateBtn" class="control-btn" title="Rotate">🔄 beeld draaien</button>
          <button id="nextBtn" class="control-btn" title="Next">volgende beeld ❯</button>
        </div>
      </div>
    </div>
  `;

  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}
  // now make the page
   renderTitle();
   renderGallery();
    renderAgenda();
   renderModal();


  
/* ensure angle persistence */
items.forEach(i => { if (typeof i.angle !== 'number') i.angle = 0; });

/* ---------- State & refs ---------- */
let currentIndex = -1;
let rotationAngle = 0;
const gallery = document.getElementById('gallery');
const modal = document.getElementById('modal');
const modalMedia = document.getElementById('modal-media');
const modalContent = document.getElementById('modalContent');
const rotateBtn = document.getElementById('rotateBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const closeBtn = document.getElementById('closeBtn');

/* ---------- Thumbnails ---------- */
items.forEach((item, idx) => {
  const t = document.createElement('div');
  t.className = 'thumb' + (item.kind === 'youtube' ? ' video' : '');
  const img = document.createElement('img');
  img.dataset.index = idx;
  if (item.kind === 'image') {
    img.src = photoPath + item.url;
    img.alt = item.url;
  } else {
    img.src = `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`;
    img.alt = 'YouTube thumbnail';
    const play = document.createElement('div'); play.className='play-btn'; play.textContent='▶';
    t.appendChild(play);
  }
  t.appendChild(img);
  gallery.appendChild(t);
});

/* ---------- Open modal ---------- */
gallery.addEventListener('click', (ev) => {
  const img = ev.target.closest('.thumb img');
  if (!img) return;
  currentIndex = Number(img.dataset.index);
  rotationAngle = items[currentIndex].angle || 0;
  openModal(currentIndex);
});

function openModal(index) {
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  showMedia(index);
}
function closeModal() {
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  modalMedia.innerHTML = '';
}

/* ---------- Core sizing logic (correct math) ---------- */
function showMedia(index) {
  modalMedia.innerHTML = '';
  const item = items[index];
  let el;
  if (item.kind === 'image') {
    el = document.createElement('img');
    el.src = photoPath + item.url;
    el.style.display = 'block';
    el.style.transformOrigin = '50% 50%';
    el.onload = () => {
      const natW = el.naturalWidth || el.width || 800;
      const natH = el.naturalHeight || el.height || 600;
      computeAndApply(el, natW, natH);
    };
    el.onerror = () => computeAndApply(el, 800, 600);
  } else {
    el = document.createElement('iframe');
    el.src = `https://www.youtube.com/embed/${item.id}?autoplay=1`;
    el.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    el.allowFullscreen = true;
    el.style.display = 'block';
    el.style.border = '0';
    el.style.transformOrigin = '50% 50%';
    // assume 16:9 intrinsic
    requestAnimationFrame(() => computeAndApply(el, 1280, 720));
  }
  modalMedia.appendChild(el);
  // set transform to stored angle (in case angle exists)
  el.style.transform = `rotate(${rotationAngle}deg)`;
}

/* compute and apply sizes correctly:
   - s = min(maxW / (intrW*cos + intrH*sin), maxH / (intrW*sin + intrH*cos), 1)
   - displayW = intrW * s; displayH = intrH * s
   - rotW = abs(displayW*cos) + abs(displayH*sin)
   - rotH = abs(displayW*sin) + abs(displayH*cos)
   - set media size to displayW/displayH, modal-content to rotW/rotH, rotate media
*/
function computeAndApply(mediaEl, intrW, intrH) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const padRatio = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--overlay-pad')) || 0.05;
  const maxW = Math.max(100, vw * (1 - 2 * padRatio));
  const maxH = Math.max(100, vh * (1 - 2 * padRatio));

  const a = rotationAngle % 360;
  const rad = a * Math.PI / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  const denomW = intrW * cos + intrH * sin;
  const denomH = intrW * sin + intrH * cos;

  const sW = denomW > 0 ? maxW / denomW : 1;
  const sH = denomH > 0 ? maxH / denomH : 1;
  const s = Math.min(sW, sH, 1);

  const displayW = Math.round(intrW * s);
  const displayH = Math.round(intrH * s);

  const rotW = Math.round(Math.abs(displayW * Math.cos(rad)) + Math.abs(displayH * Math.sin(rad)));
  const rotH = Math.round(Math.abs(displayW * Math.sin(rad)) + Math.abs(displayH * Math.cos(rad)));

  // Apply to media element (unrotated size)
  mediaEl.style.width = displayW + 'px';
  mediaEl.style.height = displayH + 'px';
  mediaEl.style.maxWidth = 'none';
  mediaEl.style.maxHeight = 'none';

  // Apply modal container to rotated bounding box
  modalContent.style.width = rotW + 'px';
  modalContent.style.height = rotH + 'px';

  // apply rotation (keeps centered)
  mediaEl.style.transform = `rotate(${rotationAngle}deg)`;
}

/* ---------- Controls ---------- */
rotateBtn.addEventListener('click', () => {
  rotationAngle = (rotationAngle + 90) % 360;
  items[currentIndex].angle = rotationAngle; // persist
  const el = modalMedia.firstElementChild;
  if (!el) return;
  // recompute using intrinsic sizes
  const intrW = (el.tagName === 'IFRAME') ? 1280 : (el.naturalWidth || el.width || 800);
  const intrH = (el.tagName === 'IFRAME') ? 720 : (el.naturalHeight || el.height || 600);
  computeAndApply(el, intrW, intrH);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % items.length;
  rotationAngle = items[currentIndex].angle || 0;
  showMedia(currentIndex);
});
prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  rotationAngle = items[currentIndex].angle || 0;
  showMedia(currentIndex);
});

closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

window.addEventListener('resize', () => {
  const el = modalMedia.firstElementChild;
  if (!el) return;
  const intrW = (el.tagName === 'IFRAME') ? 1280 : (el.naturalWidth || el.width || 800);
  const intrH = (el.tagName === 'IFRAME') ? 720 : (el.naturalHeight || el.height || 600);
  computeAndApply(el, intrW, intrH);
});
