import { SharedDataI } from "../..";
import { generateRandomId } from "../../utils/helpers";

export function createButton(sharedData: SharedDataI): HTMLElement{
    const button = document.createElement('button');
    button.id = 'drag-btn';
    button.draggable = true;
    button.textContent = 'Drag Me';

    button.addEventListener('dragstart', (event: DragEvent) => {
        const randomId = generateRandomId();
        if (event.dataTransfer) {
          event.dataTransfer.setData('text/plain', JSON.stringify({type: "button", label: sharedData.buttonLabel, id:randomId}));
        }
      });

    return button;

}