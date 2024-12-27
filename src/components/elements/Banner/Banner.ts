import { generateRandomId } from "../../../utils/helpers";
import { styleComponentButton } from "../uiHelpers";

export class BannerManager {
  private iframeDocument: Document;
  private defaultConfig = {
    imageSrc: "https://via.placeholder.com/728x90.png",
    maxWidth: "100%",
  };

  constructor(iframeDocument: Document) {
    this.iframeDocument = iframeDocument;
  }

  constructBanner({ src, maxWidth, id }: { src?: string; id: string; maxWidth?: string }): void {
    const container = this.iframeDocument.createElement("div");
    container.id = `banner-container-${id}`;
    Object.assign(container.style, {
      position: "relative",
      width: "100%",
      maxWidth: maxWidth || this.defaultConfig.maxWidth,
      margin: "0 auto",
    });

    const banner = this.iframeDocument.createElement("img");
    banner.id = `banner-${id}`;
    banner.src = src || this.defaultConfig.imageSrc;
    banner.style.display = "block";
    banner.alt = "Dropped Banner";
    Object.assign(banner.style, {
      width: "100%",
      height: "auto",
    });

    container.appendChild(banner);
    this.iframeDocument.body.appendChild(container);

    // Attach mouse events for settings
    this.handleMouseEvents(container, id);
  }

  private handleMouseEvents(container: HTMLDivElement, id: string): void {
    container.addEventListener("mouseenter", () => {
      if (!this.iframeDocument.getElementById(`${id}-button`)) {
        const button = this.createSettingsButton(id);
        container.appendChild(button);
      }
    });

    container.addEventListener("mouseleave", () => {
      const button = this.iframeDocument.getElementById(`${id}-button`);
      if (button) container.removeChild(button);
    });
  }

  private createSettingsButton(id: string): HTMLButtonElement {
    const button = this.iframeDocument.createElement("button");
    button.id = `${id}-button`;
    button.textContent = "Settings";
    Object.assign(button.style, {
      position: "absolute",
      top: "10px",
      right: "10px",
      padding: "5px 10px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    });

    button.addEventListener("click", () => {
      console.log(`Settings button clicked for banner ID: ${id}`);
      this.createSettingsMenu(id);
    });

    return button;
  }

  private createSettingsMenu(id: string): void {
    const toolbar = document.getElementById("toolbar");
    if (!toolbar) return;

    // Remove existing settings if any
    document.getElementById("leaderboard-settings")?.remove();

    const settingsContainer = document.createElement("div");
    settingsContainer.id = "leaderboard-settings";
    Object.assign(settingsContainer.style, {
        marginTop: "10px",
        padding: "15px",
        borderRadius: "8px",
        backgroundColor: "#34495E",
        color: "#ECF0F1",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
    });

    const settingsHeader = document.createElement("h3");
    settingsHeader.innerText = "Banner Settings";
    Object.assign(settingsHeader.style, {
        margin: "0 0 15px 0",
        fontSize: "18px",
        textAlign: "center",
    });

    settingsContainer.appendChild(settingsHeader);

    // Form container
    const form = document.createElement("form");
    Object.assign(form.style, {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    });

    // Banner image input
    const bannerImageLabel = document.createElement("label");
    bannerImageLabel.innerText = "Upload Banner Image";
    Object.assign(bannerImageLabel.style, {
        fontSize: "14px",
        color: "#ECF0F1",
    });

    const bannerImageInput = document.createElement("input");
    bannerImageInput.type = "file";
    bannerImageInput.accept = "image/*";
    Object.assign(bannerImageInput.style, {
        padding: "5px",
        fontSize: "14px",
        borderRadius: "4px",
        background: "#2C3E50",
        color: "#ECF0F1",
        border: "1px solid #2C3E50",
    });

    form.appendChild(bannerImageLabel);
    form.appendChild(bannerImageInput);

    // Image preview
    const imagePreview = document.createElement("img");
    Object.assign(imagePreview.style, {
        width: "100%",
        maxWidth: "728px",
        marginTop: "10px",
        display: "none",
        border: "1px solid #ccc",
        borderRadius: "4px",
    });

    form.appendChild(imagePreview);

    // Max width input
    const maxWidthLabel = document.createElement("label");
    maxWidthLabel.innerText = "Max Width (px)";
    Object.assign(maxWidthLabel.style, {
        fontSize: "14px",
        color: "#ECF0F1",
    });

    const maxWidthInput = document.createElement("input");
    maxWidthInput.type = "number";
    maxWidthInput.placeholder = "Enter max width in pixels";
    Object.assign(maxWidthInput.style, {
        padding: "5px",
        fontSize: "14px",
        borderRadius: "4px",
        background: "#2C3E50",
        color: "#ECF0F1",
        border: "1px solid #2C3E50",
    });

    form.appendChild(maxWidthLabel);
    form.appendChild(maxWidthInput);

    // Apply changes button
    const applyButton = document.createElement("button");
    applyButton.type = "button";
    applyButton.textContent = "Apply Changes";
    Object.assign(applyButton.style, {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "4px",
        background: "#1ABC9C",
        color: "#FFFFFF",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
    });

    applyButton.addEventListener("mouseover", () => {
        applyButton.style.backgroundColor = "#16A085";
    });

    applyButton.addEventListener("mouseout", () => {
        applyButton.style.backgroundColor = "#1ABC9C";
    });

    applyButton.addEventListener("click", () => {
        const banner = this.iframeDocument.getElementById(`banner-${id}`) as HTMLImageElement;
        if (!banner) {
            console.error(`Banner with ID "banner-${id}" not found.`);
            return;
        }

        // Update banner src
        if (bannerImageInput.files && bannerImageInput.files[0]) {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                banner.src = fileReader.result as string;
                imagePreview.src = fileReader.result as string;
            };
            fileReader.readAsDataURL(bannerImageInput.files[0]);
        }

        // Update max width
        const container = this.iframeDocument.getElementById(`banner-container-${id}`) as HTMLDivElement;
        if (maxWidthInput.value) {
            container.style.maxWidth = maxWidthInput.value + "px";
        }

        console.log("Banner updated successfully.");
    });

    // Delete banner button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete Banner";
    Object.assign(deleteButton.style, {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "4px",
        background: "#e74c3c",
        color: "#FFFFFF",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
    });

    deleteButton.addEventListener("mouseover", () => {
        deleteButton.style.backgroundColor = "#c0392b";
    });

    deleteButton.addEventListener("mouseout", () => {
        deleteButton.style.backgroundColor = "#e74c3c";
    });

    deleteButton.addEventListener("click", () => {
        const container = this.iframeDocument.getElementById(`banner-container-${id}`);
        if (container) {
            container.remove();
            settingsContainer.remove();
            console.log(`Banner with ID "banner-container-${id}" deleted.`);
        }
    });

    // Preview image when file is selected
    bannerImageInput.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = () => {
                imagePreview.src = fileReader.result as string;
                imagePreview.style.display = "block"; // Show preview
            };
            fileReader.readAsDataURL(file);
        } else {
            imagePreview.style.display = "none"; // Hide preview if no file is selected
        }
    });

    form.appendChild(applyButton);
    form.appendChild(deleteButton);
    settingsContainer.appendChild(form);
    toolbar.appendChild(settingsContainer);
}

}

// Creates a draggable banner button
export function createBannerButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.id = "drag-btn";
  button.draggable = true;
  button.textContent = "Banner";
  styleComponentButton(button);
  button.addEventListener("dragstart", (event: DragEvent) => {
    const randomId = generateRandomId();
    if (event.dataTransfer) {
      event.dataTransfer.setData(
        "text/plain",
        JSON.stringify({
          type: "banner",
          src: "https://via.placeholder.com/728x90.png",
          id: randomId,
        })
      );
    }
  });

  return button;
}
