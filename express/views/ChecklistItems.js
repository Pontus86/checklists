/**
 *@module ChecklistItems
 */
class ChecklistItems {
  /**
  createCheckbox2(index) {

    if (typeof index !== "number" || !Number.isInteger(index) || index < 0) {
      throw new TypeError("Index must be a non-negative integer.");
    }
    let checkbox = document.createElement("input");
    checkbox.id = "checkbox_" + index;
    checkbox.className = "form-check-input checklist-checkbox";
    checkbox.type = "checkbox";
    checkbox.style.cssFloat = "right";
    checkbox.style.transform = "translate(0px,0px)";
    checkbox.value = "checkbox";
    checkbox.style.marginLeft = "auto";
    return checkbox;
  }
  */

  createCircle(color, index, number) {
    // Create the container for the circle
    let container = document.createElement("label");
    container.className = "circle-container-" + color;

    // Create the radio button
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "radioButton" + index;
    radio.value = number;
    //radio.style.display = "none";

    // Create the circle element within the container
    let circle = document.createElement("div");
    circle.className = color + "-circle";
    circle.style.display = "flex";
    circle.style.alignItems = "center";
    circle.style.justifyContent = "center"; // Center horizontally and vertically
    


    // Append elements
    container.appendChild(radio);
    container.appendChild(circle);
    

    return container;
  }

  createCheckbox(index){
      let container = document.createElement("div");

      container.appendChild(this.createCircle("green", index, 0));
      container.appendChild(this.createCircle("yellow", index, 1));
      container.appendChild(this.createCircle("red", index, 2));
      container.id = "checkbox_" + index;
      container.style.marginLeft = "auto";
      return container
  }


  createLI(content, index) {
    if (typeof index !== "number" || !Number.isInteger(index) || index < 0) {
      throw new TypeError("Index must be a non-negative integer.");
    }
    if (!Array.isArray(content) || content.length < 2 || typeof content[0] !== "string" || typeof content[1] !== "string") {
      throw new TypeError("Content must be an array with two strings as first and second argument");
    }

    let li = document.createElement("div");

    li.id = "list_field_" + index;
    li.style.display = "flex";
    li.style.flexDirection = "row";
    li.className = "list-group-item list-group-item-action checklist-item";
    //li.href = "#";
    li.innerText = content[0];
    li.value = content[1];
    return li;
  }


  createImage(image_path) {
    if (typeof image_path !== "string") {
      throw new TypeError("Image path must be a string.");
    }
    let elem = document.createElement("img");

    //elem.src = './checklists/02_ingrepp/Coniotomi Exemple JPEG.jpg';
    elem.src = image_path;
    elem.setAttribute("height", "768");
    elem.setAttribute("width", "1024");
    elem.setAttribute("alt", "Image not loaded");
    return elem;
  }

  
}


module.exports = ChecklistItems