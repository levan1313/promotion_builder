import { generateRandomId } from "../../utils/helpers";

export function createBanner(): HTMLElement {
    // Create the banner container (image wrapper)
    const banner = document.createElement('img');
    banner.className = 'banner';
    banner.src = 'https://via.placeholder.com/150'; // Example placeholder image
    banner.alt = 'Draggable Banner';
    banner.style.width = '150px'; // Set the width
    banner.style.cursor = 'grab'; // Set the cursor for draggable UI
    banner.draggable = true; // Make it draggable
  
    // Add a dragstart event listener to the banner
    banner.addEventListener('dragstart', (event: DragEvent) => {
        const randomid = generateRandomId();

      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify({type: "banner", src: 'https://via.placeholder.com/150', id:randomid}));
      }
    });
  
    return banner;
  }
  