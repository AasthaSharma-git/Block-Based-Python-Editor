// Basic Blocks
const printBlock = {
  init: function () {
    this.appendDummyInput().appendField("print(");
    this.appendValueInput("TEXT").setCheck("String");
    this.appendDummyInput().appendField(")");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};
python.pythonGenerator.forBlock['print_block'] = function (block) {
  const text = python.pythonGenerator.valueToCode(block, 'TEXT', python.pythonGenerator.ORDER_NONE) || '""';
  return `print(${text})\n`;
};

const textBlock = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput('text'), 'TEXT');
    this.setOutput(true, 'String');
    this.setColour(160);
  }
};
python.pythonGenerator.forBlock['text_block'] = function (block) {
  const text = block.getFieldValue('TEXT');
  return [`'${text}'`, python.pythonGenerator.ORDER_ATOMIC];
};
const defineVariableBlock = {
  init: function () {
    this.appendValueInput('VALUE')
      .appendField(new Blockly.FieldTextInput("variable_name"), "VAR")
      .appendField('=')
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(160);
  }
};


python.pythonGenerator.forBlock['define_variable_block'] = function (block) {
  const varName = block.getFieldValue('VAR') || 'variable_name';
  const varValue = python.pythonGenerator.valueToCode(block, 'VALUE', python.pythonGenerator.ORDER_ATOMIC) || '""';
  return `${varName} = ${varValue}\n`;
};

// Use Variable Block
const useVariableBlock = {
  init: function () {
    this.appendDummyInput().appendField(new Blockly.FieldTextInput("variable_name"), "VAR");
    this.setOutput(true, "String");
    this.setColour(160);
  }
};

python.pythonGenerator.forBlock['use_variable_block'] = function (block) {
  const varName = block.getFieldValue('VAR') || 'variable_name';
  return [varName, python.pythonGenerator.ORDER_ATOMIC];
};


// Math Operations
const mathNumberBlock = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0), "NUM");
    this.setOutput(true, "Number");
    this.setColour(230);
  }
};
python.pythonGenerator.forBlock['math_number'] = function (block) {
  const num = block.getFieldValue('NUM');
  return [num, python.pythonGenerator.ORDER_ATOMIC];
};

const mathArithmeticBlock = {
  init: function () {
    this.appendValueInput("A")
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["+", "ADD"], ["-", "MINUS"], ["*", "MULTIPLY"], ["/", "DIVIDE"]]), "OP");
    this.appendValueInput("B")
    this.setOutput(true, "Number");
    this.setColour(230);
  }
};
python.pythonGenerator.forBlock['math_arithmetic'] = function (block) {
  const OPERATORS = {
    'ADD': '+',
    'MINUS': '-',
    'MULTIPLY': '*',
    'DIVIDE': '/'
  };
  const operator = OPERATORS[block.getFieldValue('OP')];
  const argument0 = python.pythonGenerator.valueToCode(block, 'A', python.pythonGenerator.ORDER_ATOMIC) || '0';
  const argument1 = python.pythonGenerator.valueToCode(block, 'B', python.pythonGenerator.ORDER_ATOMIC) || '0';
  return [`${argument0} ${operator} ${argument1}`, python.pythonGenerator.ORDER_ATOMIC];
};

// Logic
const controlsIfBlock = {
  init: function () {
    this.appendValueInput("IF0").setCheck("Boolean").appendField("if");
    this.appendStatementInput("DO0").appendField("then");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(210);
  }
};
python.pythonGenerator.forBlock['controls_if'] = function (block) {
  const condition = python.pythonGenerator.valueToCode(block, 'IF0', python.pythonGenerator.ORDER_ATOMIC) || 'False';
  const statements = python.pythonGenerator.statementToCode(block, 'DO0') || 'pass';
  return `if ${condition}:\n${statements}`;
};

const logicCompareBlock = {
  init: function () {
    this.appendValueInput("A")
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["==", "EQ"], ["<", "LT"], [">", "GT"]]), "OP");
    this.appendValueInput("B")
    this.setOutput(true, "Boolean");
    this.setColour(210);
  }
};
python.pythonGenerator.forBlock['logic_compare'] = function (block) {
  const operator = block.getFieldValue('OP');
  const argument0 = python.pythonGenerator.valueToCode(block, 'A', python.pythonGenerator.ORDER_ATOMIC) || '';
  const argument1 = python.pythonGenerator.valueToCode(block, 'B', python.pythonGenerator.ORDER_ATOMIC) || '';
  const operators = {
    'EQ': '==',
    'LT': '<',
    'GT': '>'
  };
  return [`${argument0} ${operators[operator]} ${argument1}`, python.pythonGenerator.ORDER_ATOMIC];
};
const logicOperationBlock = {
  init: function () {
    this.appendValueInput("A").setCheck("Boolean")
      .appendField("if");
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([["and", "AND"], ["or", "OR"]]), "OP");
    this.appendValueInput("B").setCheck("Boolean")
      .appendField("then");
    this.setOutput(true, "Boolean");
    this.setColour(220);
  }
};

python.pythonGenerator.forBlock['logic_operation'] = function (block) {
  const operator = block.getFieldValue('OP') === 'AND' ? 'and' : 'or';
  const argument0 = python.pythonGenerator.valueToCode(block, 'A', python.pythonGenerator.ORDER_LOGICAL) || 'False';
  const argument1 = python.pythonGenerator.valueToCode(block, 'B', python.pythonGenerator.ORDER_LOGICAL) || 'False';
  return [`${argument0} ${operator} ${argument1}`, python.pythonGenerator.ORDER_LOGICAL];
};

const logicNegateBlock = {
  init: function () {
    this.appendValueInput("BOOL").setCheck("Boolean")
      .appendField("not");
    this.setOutput(true, "Boolean");
    this.setColour(220);
  }
};

python.pythonGenerator.forBlock['logic_negate'] = function (block) {
  const argument0 = python.pythonGenerator.valueToCode(block, 'BOOL', python.pythonGenerator.ORDER_LOGICAL) || 'False';
  return [`not ${argument0}`, python.pythonGenerator.ORDER_LOGICAL];
};

// Loops
const controlsWhileBlock = {
  init: function () {
    this.appendValueInput("BOOL")
      .setCheck("Boolean")
      .appendField("while");
    this.appendStatementInput("DO")
      .appendField("");

    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setColour(120);
  }
};
python.pythonGenerator.forBlock['controls_while'] = function (block) {
  const condition = python.pythonGenerator.valueToCode(block, 'BOOL', python.pythonGenerator.ORDER_ATOMIC) || '';
  const statements = python.pythonGenerator.statementToCode(block, 'DO') || '';
  return `while ${condition}:\n${statements}`;
};

// Functions
const proceduresDefnoreturnBlock = {
  init: function () {
    this.appendDummyInput().appendField("def").appendField(new Blockly.FieldTextInput("myFunction"), "NAME");
    this.appendStatementInput("STACK").appendField("do");
    this.setColour(290);
  }
};
python.pythonGenerator.forBlock['procedures_defnoreturn'] = function (block) {
  const funcName = Blockly.Python.nameDB_.getName(block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  const stack = python.pythonGenerator.statementToCode(block, 'STACK') || 'pass';
  return `def ${funcName}():\n${stack}\n`;
};

// Register all blocks with Blockly
Blockly.Blocks['print_block'] = printBlock;
Blockly.Blocks['text_block'] = textBlock;
Blockly.Blocks['define_variable_block'] = defineVariableBlock;
Blockly.Blocks['use_variable_block'] = useVariableBlock;
Blockly.Blocks['math_number'] = mathNumberBlock;
Blockly.Blocks['math_arithmetic'] = mathArithmeticBlock;
Blockly.Blocks['controls_if'] = controlsIfBlock;
Blockly.Blocks['logic_compare'] = logicCompareBlock;
Blockly.Blocks['logic_negate'] = logicNegateBlock;
Blockly.Blocks['logic_operation'] = logicOperationBlock;
Blockly.Blocks['controls_while'] = controlsWhileBlock;
Blockly.Blocks['procedures_defnoreturn'] = proceduresDefnoreturnBlock;
