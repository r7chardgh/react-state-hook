const input = (function () {
  const elem = {
    name: "good module",
    total: 0,
    addInputRow: function () {
      this.total++;
      document.getElementById("root").appendChild(getInputNode(this.total));
      log("Added row <id: " + this.total + ">");
      updateTotal(this.total);
    },
    deleteInputRow: function () {
      var elems = document.getElementsByClassName("input-row-wrapper");
      if (elems.length !== 0) {
        [].forEach.call(elems, function (el, index) {
          if (index == elems.length - 1) {
            el.remove();
            log("Deleted row <id: " + el.id + ">");
          }
        });
        this.total--;
        updateTotal(this.total);
      } else {
        log("No INPUT ROW can be deleted!!!");
      }
    },
  };

  return elem;
})();
function getInputNode(id) {
  var node = document.createElement("div");
  node.className = "input-row-wrapper container row";
  node.id = id;
  return node;
}
function log(message) {
  var textNode = document.createTextNode(message);
  var breakline = document.createElement("br");
  var target = document.getElementById("log");
  document.getElementById("log").appendChild(breakline);
  document.getElementById("log").appendChild(textNode);
  target.scrollBy(0,target.clientHeight);
}

function updateTotal(total) {
  document.getElementById("total").innerHTML = total;
}
export default input;
