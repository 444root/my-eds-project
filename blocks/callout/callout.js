/* blocks/callout/callout.js */

export default function decorate(block) {
  // Get the content from the block
  const content = block.innerHTML;

  // Check if there's a title (first paragraph wrapped in <strong>)
  const firstP = block.querySelector('p');

  if (firstP) {
    const text = firstP.innerHTML;

    // If the text contains bold/strong, treat it as title
    if (text.includes('<strong>') || text.includes('<b>')) {
      // Already has formatting, leave it as is
    } else {
      // Check if first line looks like a title (short and capitalized)
      const lines = text.split('<br>');
      if (lines.length > 1 && lines[0].length < 50) {
        firstP.innerHTML = `<strong>${lines[0]}</strong>${lines.slice(1).join('<br>')}`;
      }
    }
  }

  // Add custom functionality if needed
  // For example, make it dismissible:
  const isDismissible = block.classList.contains('dismissible');

  if (isDismissible) {
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.className = 'callout-close';
    closeButton.setAttribute('aria-label', 'Close callout');

    closeButton.addEventListener('click', () => {
      block.style.display = 'none';
    });

    block.appendChild(closeButton);
  }
}