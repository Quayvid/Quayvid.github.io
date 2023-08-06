class Calculator {
    constructor(prevOpText, curOpText) {
        this.prevOpText = prevOpText
        this.curOpText = curOpText
        this.clear()
    }

    clear() {
        this.curOp = ""
        this.prevOp = ""
        this.operation = undefined
    }

    delete() {
        this.curOp = this.curOp.toString().slice(0, -1)

    }

    appendNum(num) {
        if (num === "." && this.curOp.includes(".")) return
        this.curOp = this.curOp.toString() + num.toString()
    }

    chooseOp(operation) {
        if (this.curOp === "") return
        if (this.prevOp !== "") {
            this.compute()
        }
        this.operation = operation
        this.prevOp = this.curOp
        this.curOp = ""
    }

    compute() {
        let computation
        const prev = parseFloat(this.prevOp)
        const current = parseFloat(this.curOp)
        if (isNaN(prev) || isNaN(current)) return
        switch (this.operation) {
            case "+":
                computation = prev + current
                break
            case "-":
                computation = prev - current
                break
            case "*":
                computation = prev * current
                break
            case "÷":
                computation = prev / current
                break
            default:
                return
        }
        this.curOp = computation
        this.operation = undefined
        this.prevOp = ""
    }

    getDisplayNum(num) {
        const stringNum = num.toString()
        const integerDigits = parseFloat(stringNum.split(".")[0])
        const decimalDigits = stringNum.split(".")[1]

        let intDisplay
        if (isNaN(integerDigits)) {
            intDisplay = ""
        } else {
            intDisplay = integerDigits.toLocaleString("en", { maximumFractionDigits: 0})
        }
        if (decimalDigits != null) {
            return `${intDisplay}.${decimalDigits}`
        } else {
            return intDisplay
        }
    }

    updateDisplay() {
        this.curOpText.innerText = this.getDisplayNum(this.curOp)

        if (this.operation != null) {
            this.prevOpText.innerText = `${this.getDisplayNum(this.prevOp)} ${this.operation}`
            
        } else {
            this.prevOpText.innerText = ""
        }
    }
}

const numButtons = document.querySelectorAll("[data-number]")
const opButtons = document.querySelectorAll("[data-operation]")
const equalsButton = document.querySelector("[data-equals]")
const delButton = document.querySelector("[data-delete]")
const allClearButton = document.querySelector("[data-all-clear]")
const prevOpText = document.querySelector("[data-previous-operand]")
const curOpText = document.querySelector("[data-current-operand]")

const calculator = new Calculator(prevOpText, curOpText)

numButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNum(button.innerText)
        calculator.updateDisplay()
    })
})

opButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOp(button.innerText)
        calculator.updateDisplay()
    })
})

equalsButton.addEventListener("click", button => {
    calculator.compute()
    calculator.updateDisplay()
})

allClearButton.addEventListener("click", button => {
    calculator.clear()
    calculator.updateDisplay()
})

delButton.addEventListener("click", button => {
    calculator.delete()
    calculator.updateDisplay()
})