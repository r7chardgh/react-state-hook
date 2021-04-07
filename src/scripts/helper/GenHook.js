const genhook = (function () {
  const elem = {
    inputId: "target",
    outputId: "result",
    init: function (inputId, outputId) {
      log("initializing...");
      if (inputId === undefined || inputId === null || inputId?.length === 0) {
        inputId = this.inputId;
      } else {
        this.inputId = inputId;
      }
      if (
        outputId === undefined ||
        inputId === null ||
        outputId?.length === 0
      ) {
        outputId = this.outputId;
      } else {
        this.outputId = outputId;
      }
      addOnChange(this.inputId, this.outputId);
    },
  };

  return elem;
})();

function addOnChange(inputId, outputId) {
  try {
    var result = "";
    document.getElementById(inputId).onchange = function () {
      result = convertToObject(document.getElementById(inputId).value);
      updateResult(inputId, outputId, result);
    };
    log("Initialized");
  } catch (err) {
    console.log(err);
    console.warn(
      "You should make sure your inputId: " + inputId + " is correct."
    );
    log("Something went wrong...initializing failed!");
  }

  return false;
}
function updateResult(inputId, outputId, result) {
  try {
    displayObject(result);
    displayJSON(result);
    displayState(result);
    log("Result is updated.");
  } catch (err) {
    console.log(err);
    console.warn(
      "You should make sure your outputId: " + outputId + " is correct."
    );
    log("Something went wrong... the result is not up-to-date.");
  }
}
function convertToObject(text) {
  const propPatt = /([a-z_$][a-z_$0-9]*)(?:\s*:)/gim;
  const valPatt = /(?::[\s]*)['|"](.*?)['|"]|(?::[\s]*)([-.0-9]+)|(?::[\s]*)([a-z_$(].*?[^}]+[}])(?:[^,]{0,1})|(?::[\s]*)([null]+)/gim;
  //case1:(?::[\s]*)['|"](.*?)['|"] -string
  //case2:(?::[\s]*)([-.0-9]+) -number
  //case3:(?::[\s]*)([a-z_$(].*?[^}]+[}])(?:[^,]{0,1}) -function
  //case4:(?::[\s]*)([null]+) -null
  //case5:(?::[\s]*)({.*?}) -object <not avail.>
  //case6:(?::[\s]*)(\[.*?\]) -array <not avail.>

  const addCommaPatt = /([^a-z0-9}"']+)}$/gim;
  var match;
  var values = [];
  var properties = [];
  while ((match = propPatt.exec(text))) {
    properties.push(match[1]);
  }
  while ((match = valPatt.exec(text))) {
    if (match[1]?.length === 0) values.push("");
    if (match[1]) {
      try {
        values.push(match[1]);
      } catch (err) {
        console.log(err);
        log(
          "Something went wrong... the STRING has not saved yet! Please make sure you type it right!"
        );
      }
    } else if (match[2]) {
      try {
        values.push(Number(match[2]));
      } catch (err) {
        console.log(err);
        log(
          "Something went wrong... the NUMBER has not saved yet! Please make sure you type it right!"
        );
      }
    } else if (match[3]) {
      try {
        values.push(
          Function(
            '"use strict";return (' +
              match[3]?.replaceAll(/\n/g, "").replaceAll(/\'|\"/g, "'") +
              ")"
          )()
        );
      } catch (err) {
        console.log(err);
        log(
          "Something went wrong... the FUNCTION OBJECT has not saved yet! Please make sure you type it right!"
        );
      }
    } else if (match[4]) {
      try {
        values.push(null);
      } catch (err) {
        console.log(err);
        log(
          "Something went wrong... the NULL has not saved yet! Please make sure you type it right!"
        );
      }
    }
  }
  const result = values.reduce(function (result, field, index) {
    result[properties[index]] = field;
    return result;
  }, {});
  if (values.length === 0) log("Your input is empty or not validated");
  else log("Text is converted to an object.");
  return result;
}
function displayObject(result) {
  var str = "{\n";
  for (const key in result) {
    if (typeof result[key] === "string")
      str += key + ': "' + result[key] + '",\n';
    else str += key + ": " + result[key] + ",\n";
  }
  str += "}";
  document.getElementById("objResult").innerText = str;
}
function displayJSON(result) {
  document.getElementById("jsonResult").innerText = JSON.stringify(
    result,
    function (key, value) {
      if (typeof value === "function") {
        return value.toString();
      }
      return value;
    },
    4
  );
}
function displayState(result) {
  var str = "";
  for (const key in result) {
    if (typeof result[key] === "string")
      str +=
        "const [" +
        key +
        ",set" +
        key.charAt(0).toUpperCase() +
        key.slice(1) +
        '] = useState("' +
        result[key] +
        '");\n';
    else
      str +=
        "const [" +
        key +
        ",set" +
        key.charAt(0).toUpperCase() +
        key.slice(1) +
        "] = useState(" +
        result[key] +
        ");\n";
  }
  document.getElementById("stateResult").innerText = str;
}

function log(message, err) {
  var textNode = document.createTextNode(message);
  var breakline = document.createElement("br");
  var target = document.getElementById("log");
  try {
    target.appendChild(breakline);
    target.appendChild(textNode);
    target.scrollBy(0, target.clientHeight);
  } catch (err) {
    console.log(err);
    console.warn("No such log area!!! Please add element with <id: log>");
  }
}
export default genhook;
