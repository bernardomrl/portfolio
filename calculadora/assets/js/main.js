const   numberButtons       = document.querySelectorAll("[data-number]"),
        operationButtons    = document.querySelectorAll("[data-operator]"),
        // BOTOES SINGLE
        equalsButton        = document.querySelector("[data-equals]"),
        deleteButton        = document.querySelector("[data-delete]"),
        allClearButton      = document.querySelector("[data-allclear]"),
        // DISPLAY
        previous            = document.querySelector("[data-previous]"),
        current             = document.querySelector("[data-current]"); 

class Calculator {
    constructor(previous,current){
        this.previous = previous;
        this.current = current;
        this.clear();
    }

    calculate() {
        let result;

        const _previousOperand = parseFloat(this.previousOperand);
        const _currentOperand = parseFloat(this.currentOperand);
    }

    chooseOperation(operation) {
        if (this.previousOperand !== '') {
            this.calculate();
        }

        this.operation = operation;

        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
    }

    appendNumber(number) {
        if (this.currentOperand.includes('.') && number === '.') return;

        this.currentOperand = `${this.currentOperand}${number.toString()}`
    }

    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    updateDisplay(){
        this.previous.innerText = `${this.currentOperand} ${this.operation || ''}`;
        this.current.innerText = this.currentOperand;
    }
}

const calculator = new Calculator(
    previous,
    current
);

for (const numberButton of numberButtons) {
    numberButton.addEventListener('click', () => {
        calculator.appendNumber(numberButton.innerText);
        calculator.updateDisplay();
    })
}

for (const operationButton of operationButtons) {
    operationButton.addEventListener('click', () => {
        calculator.chooseOperation(operationButton.innerText);
        calculator.updateDisplay();
    })
}

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
})