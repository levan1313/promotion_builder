import { styleComponentButton } from "./uiHelpers";

interface GeneralSettingsProps {
    iframeDocument: HTMLIFrameElement;
}

export function createGeneralSettings(options: GeneralSettingsProps): HTMLElement {
    const { iframeDocument } = options;

    const container = document.createElement("div");
    container.id = "general-settings";

    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.marginTop = "10px";
    form.style.gap = "15px";

    // Background image input
    const backgroundImageInput = document.createElement("input");
    backgroundImageInput.type = "file";
    backgroundImageInput.accept = "image/*"; // Accept only image files
    backgroundImageInput.style.display = "none"; // Hide default file input

    const uploadButton = document.createElement("button");
    uploadButton.type = "button";
    uploadButton.textContent = "Upload Background Image";
    uploadButton.style.display = "flex";
    uploadButton.style.alignItems = "center";
    uploadButton.style.justifyContent = "center";
    uploadButton.style.gap = "10px";

    // Add an icon to the button
    const uploadIcon = document.createElement("span");
    uploadIcon.innerHTML = "📤"; // Use an emoji or SVG icon
    uploadIcon.style.fontSize = "20px";
    uploadButton.prepend(uploadIcon);

    // Style the upload button
    styleComponentButton(uploadButton);

    // Add click event to trigger file input
    uploadButton.addEventListener("click", () => {
        backgroundImageInput.click();
    });

    // Image preview
    const imagePreview = document.createElement("img");
    imagePreview.style.display = "none"; // Hidden initially
    imagePreview.style.width = "100%";
    imagePreview.style.marginTop = "10px";
    imagePreview.style.border = "1px solid #ccc";
    imagePreview.style.borderRadius = "5px";

    // Reset button to remove background image
    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.textContent = "Delete Background";
    resetButton.style.marginTop = "10px";
    resetButton.style.padding = "5px 10px";
    resetButton.style.backgroundColor = "#ff4d4d";
    resetButton.style.color = "#fff";
    resetButton.style.border = "none";
    resetButton.style.borderRadius = "5px";
    resetButton.style.cursor = "pointer";
    resetButton.style.display = "none"; // Hidden initially

    // Gap control slider
    const gapLabel = document.createElement("label");
    gapLabel.innerText = "Gap Between Elements (px):";
    gapLabel.style.color = "#fff";

    const gapSliderContainer = document.createElement("div");
    gapSliderContainer.style.display = "flex";
    gapSliderContainer.style.alignItems = "center";
    gapSliderContainer.style.gap = "10px";

    const gapSlider = document.createElement("input");
    gapSlider.type = "range";
    gapSlider.min = "0";
    gapSlider.max = "200";
    gapSlider.value = "0"; // Default value
    gapSlider.style.width = "100%";

    const gapValueDisplay = document.createElement("span");
    gapValueDisplay.innerText = "0px";
    gapValueDisplay.style.color = "#fff";

    // colors

    const { colorsContainer, inputs } = createColorsContainer();

    // Update gap dynamically
    gapSlider.addEventListener("input", (event: Event) => {
        const target = event.target as HTMLInputElement;
        const gapValue = parseInt(target.value, 10) || 0;
        gapValueDisplay.innerText = `${gapValue}px`;

        if (iframeDocument.contentDocument?.body) {
            const bodyChildren = Array.from(iframeDocument.contentDocument.body.children);
            bodyChildren.forEach((child) => {
                (child as HTMLElement).style.marginBottom = `${gapValue}px`;
            });
        }
    });

    gapSliderContainer.appendChild(gapSlider);
    gapSliderContainer.appendChild(gapValueDisplay);

    // Handle file selection and preview
    backgroundImageInput.addEventListener("change", (event: Event) => {
        const target = event.target as HTMLInputElement;

        if (target.files && target.files[0]) {
            const file = target.files[0];
            const fileReader = new FileReader();

            fileReader.onload = () => {
                if (iframeDocument.contentDocument?.body) {
                    imagePreview.src = fileReader.result as string;
                    imagePreview.style.display = "block"; // Show preview
                    iframeDocument.contentDocument.body.style.backgroundImage = `url(${fileReader.result})`; // Set background image
                    iframeDocument.contentDocument.body.style.backgroundSize = "cover";
                    iframeDocument.contentDocument.body.style.backgroundRepeat = "no-repeat";
                    resetButton.style.display = "inline-block"; // Show reset button
                } else {
                    console.error("Iframe contentDocument or body is not accessible.");
                }
            };

            fileReader.readAsDataURL(file);
        }
    });

    // Handle reset button click
    resetButton.addEventListener("click", () => {
        if (iframeDocument.contentDocument?.body) {
            iframeDocument.contentDocument.body.style.backgroundImage = ""; // Remove background image
            imagePreview.style.display = "none"; // Hide preview
            backgroundImageInput.value = ""; // Clear input
            resetButton.style.display = "none"; // Hide reset button
        }
    });

    // Append elements to the form
    form.appendChild(uploadButton);
    form.appendChild(backgroundImageInput);
    form.appendChild(imagePreview);
    form.appendChild(resetButton);
    form.appendChild(gapLabel);
    form.appendChild(gapSliderContainer);

    form.appendChild(colorsContainer);

    container.appendChild(form);

    return container;
}


// Function to create a labeled color input
function createColorInput({ labelText, defaultValue }:{labelText: string, defaultValue: string}) {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "10px";
  
    const label = document.createElement("label");
    label.innerText = labelText;
    label.style.color = "#fff";
    label.style.flex = "1";
  
    const input = document.createElement("input");
    input.type = "color";
    input.value = defaultValue;
    input.style.width = "50px";
    input.style.height = "30px";
    input.style.border = "none";
    input.style.cursor = "pointer";
  
    container.appendChild(label);
    container.appendChild(input);
  
    return { container, input };
  }
  
  // Function to create the colors container
  function createColorsContainer() {
    const colorsContainer = document.createElement("div");
    colorsContainer.style.display = "flex";
    colorsContainer.style.flexDirection = "column";
    colorsContainer.style.gap = "15px";
    colorsContainer.style.padding = "10px";
    colorsContainer.style.borderRadius = "8px";
    colorsContainer.style.backgroundColor = "#2C3E50";
  
    const colorsContainerHeading = document.createElement("h3");
    colorsContainerHeading.innerText = "Colors";
    colorsContainerHeading.style.color = "#fff";
    colorsContainerHeading.style.marginBottom = "10px";
    colorsContainerHeading.style.textAlign = "center";
    colorsContainer.appendChild(colorsContainerHeading);
  
    // Create individual color inputs
    const primaryColorInput = createColorInput({
      labelText: "Primary Color",
      defaultValue: "#000000",
    });
    const secondaryColorInput = createColorInput({
      labelText: "Secondary Color",
      defaultValue: "#ffffff",
    });
    const baseColorInput = createColorInput({
      labelText: "Base Color",
      defaultValue: "#f0f0f0",
    });
  
    // Append inputs to the container
    colorsContainer.appendChild(primaryColorInput.container);
    colorsContainer.appendChild(secondaryColorInput.container);
    colorsContainer.appendChild(baseColorInput.container);
  
    return { colorsContainer, inputs: { primaryColorInput, secondaryColorInput, baseColorInput } };
  }