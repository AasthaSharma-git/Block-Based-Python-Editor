// Initialize Blockly workspace and buttons
function initBlockly() {
  // Initialize Blockly workspace with 'toolbox' XML
  var workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    media: 'https://unpkg.com/blockly/media/',
    trashcan: true,
    sounds: true,
    maxBlocks: Infinity,
    variableDB: Blockly.Variables,
  });

 // Function to update Python code dynamically
 function updateCode() {
  var code = Blockly.Python.workspaceToCode(workspace);
  document.getElementById('codeDisplay').textContent = code;
}

// Add event listener for any changes in the workspace
workspace.addChangeListener(function(event) {
  if (event.type === Blockly.Events.BLOCK_CREATE ||
      event.type === Blockly.Events.BLOCK_MOVE ||
      event.type === Blockly.Events.BLOCK_DELETE ||
      event.type === Blockly.Events.BLOCK_CHANGE) {
    updateCode();  // Update the code whenever a change happens
  }
});


  // Button to run Python code (using Pyodide or other methods)
  document.getElementById('runCode').addEventListener('click', function () {
    var code = Blockly.Python.workspaceToCode(workspace);
    runPythonCode(code);
  });


}
async function runPythonCode(code) {
  // Load Pyodide if it hasn't been loaded already
  let pyodide = await loadPyodide();

  // Redirect output
  pyodide.runPython(`
      import sys
      from io import StringIO
      output = StringIO()
      sys.stdout = output
  `);

  // Run the user's code
  pyodide.runPython(code);

  // Retrieve the output and reset stdout
  const output = pyodide.runPython(`
      sys.stdout = sys.__stdout__
      output.getvalue()
  `);

  // Replace newlines with <br> for HTML output
  const formattedOutput = output.replace(/\n/g, "<br>");

  // Display the output in your UI
  document.getElementById('outputText').innerHTML = formattedOutput;
}



// Initialize Blockly when the page loads
window.addEventListener('DOMContentLoaded', (event) => {
  initBlockly();
  // Functionality to make the divider draggable
  const divider = document.getElementById("divider");
  const leftSection = document.getElementById("leftSection");
  const rightSection = document.getElementById("rightSection");

  let isDragging = false;

  divider.addEventListener("mousedown", (e) => {
    isDragging = true;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    if (isDragging) {
      // Calculate the new width of the left section based on mouse position
      let newLeftWidth = (e.clientX / window.innerWidth) * 100; // Percentage of window width
      let newRightWidth = 100 - newLeftWidth;

      // Update the widths of the left and right sections
      if (newLeftWidth >= 30 && newLeftWidth <= 80) {
        leftSection.style.width = `${newLeftWidth}%`;
        rightSection.style.width = `${newRightWidth}%`;
      }
    }
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }


});

