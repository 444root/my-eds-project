export default async function decorate(block) {
  const resp = await fetch('/nav.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const sections = doc.body.querySelectorAll(':scope > div');

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  const classNames = ['nav-brand', 'nav-sections', 'nav-tools'];

  sections.forEach((section, i) => {
    const div = document.createElement('div');
    div.className = classNames[i] || 'nav-extra';
    div.innerHTML = section.innerHTML;

    if (i === 1) {
      div.querySelectorAll(':scope ul > li').forEach((li) => {
        if (li.querySelector('ul')) {
          li.classList.add('nav-drop');
          li.setAttribute('aria-expanded', 'false');
          li.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = li.getAttribute('aria-expanded') === 'true';
            div.querySelectorAll('.nav-drop').forEach((drop) => {
              drop.setAttribute('aria-expanded', 'false');
            });
            li.setAttribute('aria-expanded', String(!isExpanded));
          });
        }
      });
    }

    if (i === 2) {
      const toolsP = div.querySelectorAll('p');
      toolsP.forEach((p, pIndex) => {
        if (pIndex === 1) {
          const text = p.innerHTML;
          const items = text.split(/<br\s*\/?>/i)
            .map((item) => item.trim())
            .filter((item) => item && item !== '—' && item !== '-');

          const buttons = items.map((item) => {
            const slug = item.toLowerCase().replace(/\s+/g, '-');
            return `<a href="/${slug}">${item}</a>`;
          }).join('');
          p.innerHTML = buttons;
        }
      });
    }

    nav.appendChild(div);
  });

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Menu">
    <span class="nav-hamburger-icon"></span>
  </button>`;

  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
  });

  nav.prepend(hamburger);
  block.textContent = '';
  block.appendChild(nav);
}
