import Input from "./helper/input.js";
import Genhook from "./helper/GenHook.js";
// document.getElementById("addrow").onclick = (evt) => {
//   evt.preventDefault();
//   Input.addInputRow();
// };

// document.getElementById("deleterow").onclick = (evt) => {
//   evt.preventDefault();
//   Input.deleteInputRow();
// };

document.getElementById("logClean").onclick = (evt) => {
  evt.preventDefault();
  document.getElementById("log").innerHTML = "<br>cleaned";
};

Genhook.init();
