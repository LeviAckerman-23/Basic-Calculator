// Global variables to keep track of the current input and screen element
let screen = document.getElementById('screen');
let currentInput = '';  // This stores the current string of operations

/**
 * Appends the clicked value to the screen and the current input string
 * @param {string} value - The value to append (number or operator)
 */
function appendToScreen(value) {
    if (screen.innerHTML === '0' && !isNaN(value)) {
        screen.innerHTML = value;
    } else {
        screen.innerHTML += value;
    }
    currentInput += value;
}

/**
 * Clears the calculator screen and resets the current input
 */
function clearScreen() {
    screen.innerHTML = '0';
    currentInput = '';
}

/**
 * Deletes the last character in the current input and updates the screen
 */
function backspace() {
    currentInput = currentInput.slice(0, -1); // Remove the last character from input
    if (currentInput === '') {
        screen.innerHTML = '0';
    } else {
        screen.innerHTML = currentInput;
    }
}

/**
 * Parses and evaluates the currentInput based on BODMAS rules, safely without eval
 */
function calculateResult() {
    try {
        let result = safeEvaluate(currentInput);  // Use safeEvaluate instead of eval
        screen.innerHTML = result;
        currentInput = result.toString();  // Update the input with the result for future calculations
    } catch (e) {
        screen.innerHTML = 'ERROR';
        currentInput = '';  // Reset input after error
    }
}

/**
 * Safely evaluates the input string by converting it into a mathematical expression
 * @param {string} input - The string containing the mathematical expression
 * @returns {number} - The result of the expression
 */
function safeEvaluate(input) {
    // Handle division by zero manually
    if (input.includes('/0')) {
        throw new Error('Cannot divide by zero');
    }

    // Regex to find operators and split them from numbers
    const operators = /([+\-*/])/g;

    // Separate the input into parts, ensuring that the order of operations is respected
    let tokens = input.split(operators);
    let stack = [];
    let operatorStack = [];

    const precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    // Process the tokens based on precedence of operators (BODMAS)
    for (let token of tokens) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token)); // Push numbers to the stack
        } else {
            // While there's an operator with higher precedence in the operator stack
            while (operatorStack.length && precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]) {
                let op = operatorStack.pop();
                let b = stack.pop();
                let a = stack.pop();
                stack.push(applyOperator(op, a, b));  // Apply the operation and push the result back
            }
            operatorStack.push(token); // Push current operator to operator stack
        }
    }

    // After processing all tokens, apply the remaining operators
    while (operatorStack.length) {
        let op = operatorStack.pop();
        let b = stack.pop();
        let a = stack.pop();
        stack.push(applyOperator(op, a, b));
    }

    return stack[0];  // The result is the only item remaining in the stack
}

/**
 * Applies a mathematical operator to two operands
 * @param {string} operator - The operator to apply (+, -, *, /)
 * @param {number} a - The first operand
 * @param {number} b - The second operand
 * @returns {number} - The result of the operation
 */
function applyOperator(operator, a, b) {
    switch (operator) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: throw new Error('Invalid operator');
    }
}
