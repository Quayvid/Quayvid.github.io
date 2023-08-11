//Constructor class for the calculator
class Calculator {
    //prevOpText and curOpText shows the text of the previous and current operands, respectively
    constructor(prevOpText, curOpText) {
        this.prevOpText = prevOpText
        this.curOpText = curOpText
        this.clear()                                          //Sets everything to default values (nothing)
    }

    //Clears out the current & previous operands, and the operation
    clear() {
        this.curOp = ""                                       //sets this.curOp to have no value
        this.prevOp = ""                                      //sets this.prevOp to have no value
        this.operation = undefined                            //sets this.operation to be undefined
    }

    //Deletes a number from the current operand
    delete() {
        this.curOp = this.curOp.toString().slice(0, -1)       //removes the rightmost number/decimal point from this.curOp
    }

    //Adds a number to the current operand
    appendNum(num) {
        if (num === "." && this.curOp.includes(".")) return   //don't add more than one decimal point to the current operand
        this.curOp = this.curOp.toString() + num.toString()   //append a number/decimal point to the current operand
    }

    //Determines what operator will be used in the operation (i.e. if the + button is
    //pressed the operator will be +)
    chooseOp(operation) {
        if (this.curOp === "") return                         //exit chooseOp if this.curOp is empty
        if (this.prevOp !== "") {                             //this checks if the user presses an operand, operator, operand and an operator in that order
            this.compute()
        }
        this.operation = operation                            //set this.operation to the operation passed in the function
        this.prevOp = this.curOp                              //set this.prevOp to this.curOp
        this.curOp = ""                                       //remove the value of this.curOp
    }

    //Computes a single value from the operand and this.curOpText & this.prevOpText
    compute() {
        let computation                                       //result of the computation
        const prev = parseFloat(this.prevOp)                  //converts this.curOp into an actual number
        const current = parseFloat(this.curOp)                //converts this.prevOp into an actual number
        if (isNaN(prev) || isNaN(current)) return             //exits the function if prev or current doesn't have a value
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
                console.log(computation)
                /*if (prev === 0 && current === 0) {
                    this.curOp = "Error"
                }*/
                break
            default:
                console.log("something's wrong I can feel it")
                return
        }
        this.curOp = computation                               //sets this.curOp to the resulting computation
        this.operation = undefined                             //sets this.operation to be undefined
        this.prevOp = ""                                       //sets this.prevOp to no value
    }

    //Formats large numbers with commas
    getDisplayNum(num) {
        const stringNum = num.toString()                                                     //convert a given num to a string format
        const integerDigits = parseFloat(stringNum.split(".")[0])                            //get the integer portion of a number to format the commas
        const decimalDigits = stringNum.split(".")[1]                                        //get the decimal portion of a number

        let intDisplay
        if (isNaN(integerDigits)) {                                                          //check if integerDigits is a NaN or not, meant for when the user inputs
                                                                                             //nothing, or just a decimal place
            intDisplay = ""
        } else {
            intDisplay = integerDigits.toLocaleString("en", { maximumFractionDigits: 0})     //makes intDisplay equal to the comma styled format of the integer portion
                                                                                             //of num
        }
        if (decimalDigits != null) {
            return `${intDisplay}.${decimalDigits}`
        } else {
            return intDisplay                                                                //removes the previous intDisplay
        }
    }

    //Updates the display on the calculator
    updateDisplay() {
        if (isNaN(this.curOp)) {
            this.curOpText.innerText = "NaN"
            this.prevOpText.innerText = ''
            this.curOp = ''
            this.prevOp = ''
            this.operation = undefined
            return
        } else {
            this.curOpText.innerText = this.getDisplayNum(this.curOp)
        }

        if (this.operation != null) {                                                                //check if the operation is not null
            this.prevOpText.innerText = `${this.getDisplayNum(this.prevOp)} ${this.operation}`       //Display the previous operand along with the selected operation
            
        } else {
            this.prevOpText.innerText = ""                                                           //Display nothing for the prev. operand if the operation if calc'd
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