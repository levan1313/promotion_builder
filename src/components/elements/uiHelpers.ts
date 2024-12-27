export function styleComponentButton(button: HTMLElement): void {
    Object.assign(button.style, {
      padding: "10px 15px",
      backgroundColor: "#1ABC9C",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "5px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
      transition: "background-color 0.2s, transform 0.2s",
      display: "block",
      width: "100%",
      margin: "10px 0px"
    });
  
    // Add hover and active effects
    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#16A085";
    });
    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "#1ABC9C";
    });
  }
  