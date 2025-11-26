import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const fragment = await loadFragment('/nav');
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  const classNames = ['nav-brand', 'nav-sections', 'nav-tools'];
  const sections = fragment.querySelectorAll(':scope .section');

  sections.forEach((section, i) => {
    const div = document.createElement('div');
    div.className = classNames[i] || 'nav-extra';

    while (section.firstChild) {
      div.appendChild(section.firstChild);
    }

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
