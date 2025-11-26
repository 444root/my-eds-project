function waitForCSSLoad() {
  return new Promise((resolve) => {
    const styleSheets = document.styleSheets;
    const checkCSS = () => {
      for (let i = 0; i < styleSheets.length; i += 1) {
        if (styleSheets[i].href && styleSheets[i].href.includes('header.css')) {
          resolve();
          return;
        }
      }
      requestAnimationFrame(checkCSS);
    };
    checkCSS();
  });
}

export default async function decorate(block) {
  const resp = await fetch('/nav.plain.html');
  if (!resp.ok) {
    console.error('Failed to load nav:', resp.status);
    return;
  }

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

    if (i === 1) {
      const wrapper = document.createElement('div');
      wrapper.className = 'default-content-wrapper';
      wrapper.innerHTML = section.innerHTML;

      wrapper.querySelectorAll(':scope ul > li').forEach((li) => {
        if (li.querySelector('ul')) {
          li.classList.add('nav-drop');
          li.setAttribute('aria-expanded', 'false');

          li.addEventListener('click', (e) => {
            e.stopPropagation();
            const expanded = li.getAttribute('aria-expanded') === 'true';
            wrapper.querySelectorAll('.nav-drop').forEach((drop) => {
              drop.setAttribute('aria-expanded', 'false');
            });
            li.setAttribute('aria-expanded', String(!expanded));
          });
        }
      });

      div.appendChild(wrapper);
    } else {
      div.innerHTML = section.innerHTML;
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

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);

  await waitForCSSLoad();

  block.textContent = '';
  block.append(navWrapper);
}
