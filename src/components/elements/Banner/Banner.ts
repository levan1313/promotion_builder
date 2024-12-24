import { generateRandomId } from "../../../utils/helpers";

export class BannerManager {
  private iframeDocument: Document;

  constructor (iframeDocument: Document){
    this.iframeDocument = iframeDocument;
  }

   constructBanner () {
    const banner = document.createElement('img');
    banner.src = 'https://via.placeholder.com/728x90.png';
    banner.alt = 'Dropped Banner';
    banner.style.width = '100%';
    banner.style.height = 'auto';

    this.iframeDocument.body.appendChild(banner);
  }
}

  export function createBannerButton(){
    const button = document.createElement('button');
    button.id = 'drag-btn';
    button.draggable = true;
    button.textContent = 'banner';

    button.addEventListener('dragstart', (event: DragEvent) => {
        const randomId = generateRandomId();
        if (event.dataTransfer) {
          event.dataTransfer.setData('text/plain', JSON.stringify({type: "button", label: 'button', id:randomId}));
        }
      });

    return button;
  }