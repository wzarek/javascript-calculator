export default class Calculator{
    #type
    #containerClass
    #numberClass
    #operatorClass
    #outputClass

    #result = 0
    #resultActive = false

    #currentNumber = ''
    #previousNumber = ''
    #currentOperator

    #currentOperation

    #operators = ['+', '-', 'x', '/']
    #operatorsPriority = {'x' : 2, '/' : 2, '+' : 1, '-' : 1}

    constructor(type, containerClass = 'calc-container', numClass = 'calc-numbers', opClass = 'calc-operators', outClass = 'calc-output'){
        this.#type = type
        this.#containerClass = containerClass
        this.#numberClass = numClass
        this.#operatorClass = opClass
        this.#outputClass = outClass

        this.#checkClasses()
        this.#updateOutput()
        this.#createNumbers()
        this.#createOperators()
    }

    #checkClasses(){
        let calcContainer = document.querySelector(`.${this.#containerClass}`)
        if (calcContainer == null){
            let containerTemp = document.createElement('div')
            containerTemp.className = `${this.#containerClass}`
            document.appendChild(containerTemp)
            calcContainer = document.querySelector(`.${this.#containerClass}`)
        }
        
        let operatorsContainer = document.querySelector(`.${this.#operatorClass}`)
        if (operatorsContainer == null){
            let containerTemp = document.createElement('div')
            containerTemp.className = `${this.#operatorClass}`
            calcContainer.appendChild(containerTemp)
            operatorsContainer = document.querySelector(`.${this.#operatorClass}`)
        }

        let numbersContainer = document.querySelector(`.${this.#numberClass}`)
        if (numbersContainer == null){
            let containerTemp = document.createElement('div')
            containerTemp.className = `${this.#numberClass}`
            calcContainer.appendChild(containerTemp)
            numbersContainer = document.querySelector(`.${this.#numberClass}`)
        }

        let outputContainer = document.querySelector(`.${this.#outputClass}`)
        if (numbersContainer == null){
            let containerTemp = document.createElement('div')
            containerTemp.className = `${this.#outputClass}`
            calcContainer.appendChild(containerTemp)
            outputContainer = document.querySelector(`.${this.#outputClass}`)
        }
        let clearButton = outputContainer.querySelector('.calc-clear-button')
        if (clearButton == null){
            let containerTemp = document.createElement('div')
            containerTemp.className = 'calc-clear-button'
            containerTemp.innerText = 'clear'
            outputContainer.appendChild(containerTemp)
            clearButton = document.querySelector('.calc-clear-button')
        }
        let resultSpan = outputContainer.querySelector('.calc-output-span')
        if (resultSpan == null){
            let containerTemp = document.createElement('span')
            containerTemp.className = 'calc-output-span'
            outputContainer.appendChild(containerTemp)
            resultSpan = document.querySelector('.calc-output-span')
        }
        clearButton.addEventListener('click', () => {
            this.#renewOutput(0)
        })
    }

    #createOperators(){
        const operatorsContainer = document.querySelector(`.${this.#operatorClass}`)

        for(let op of this.#operators){
            let opDiv = document.createElement('div')
            opDiv.className = 'calc-operator calc-operator-button'
            opDiv.innerText = op

            operatorsContainer.appendChild(opDiv)
        }

        const operatorsDivs = document.querySelectorAll('.calc-operator-button')
        operatorsDivs.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.#appendOperator(btn.innerText)
            })
        })
    }

    #createNumbers(){
        const numbersContainer = document.querySelector(`.${this.#numberClass}`)
        let numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]

        for(let i of numbers){
            let numDiv = document.createElement('div')
            numDiv.className = 'calc-number calc-number-button'
            numDiv.innerText = i

            numbersContainer.appendChild(numDiv)
        }

        let resDiv = document.createElement('div')
        resDiv.className = 'calc-number calc-result-button'
        resDiv.innerText = '='

        resDiv.addEventListener('click', () => {
            this.#getResult()
        })

        let dotDiv = document.createElement('div')
        dotDiv.className = 'calc-number calc-dot-button'
        dotDiv.innerText = '.'

        numbersContainer.appendChild(dotDiv)
        numbersContainer.appendChild(resDiv)

        const numbersDivs = document.querySelectorAll('.calc-number-button')
        numbersDivs.forEach((btn) => {
            btn.addEventListener('click', () => {
                this.#appendNumber(btn.innerText)
            })
        })
    }

    #appendNumber(num){
        if (!this.#resultActive){
            this.#result = num
            this.#resultActive = true
        }else{
            this.#result += num
        }
        this.#currentNumber += num

        const prev = document.querySelector('.calc-output-previous')
        if (prev != null) prev.remove()

        this.#updateOutput()
    }

    #appendOperator(op){
        const testResult = this.#operators.some(el => this.#result[this.#result.length - 1].includes(el));
        if (this.#resultActive && testResult == 0){
            if (this.#previousNumber != '') this.#calculateNow()
            this.#result += op
            this.#previousNumber = this.#currentNumber
            this.#currentNumber = ''
            this.#currentOperator = op

            const prev = document.querySelector('.calc-output-previous')
            if (prev != null) prev.remove()

            this.#updateOutput()
        }
    }

    #calculateNow(){
        const operation = new Operation(this.#previousNumber, this.#currentNumber, this.#currentOperator)
        this.#currentNumber = operation.getResult()
    }

    #updateOutput(){
        const outputContainer = document.querySelector(`.${this.#outputClass} .calc-output-span`)

        outputContainer.innerText = this.#result
    }

    #getResult(){
        if (this.#currentNumber == '') return
        const operation = new Operation(this.#previousNumber, this.#currentNumber, this.#currentOperator)

        this.#currentOperation = this.#result
        const outputContainer = document.querySelector('.calc-output')
        let prevOperation = document.createElement('div')
        prevOperation.className = 'calc-output-previous'
        prevOperation.innerText = `${this.#currentOperation} = `
        outputContainer.appendChild(prevOperation)

        this.#result = operation.getResult()
        this.#renewOutput(this.#result, false)
    }

    #renewOutput(toShow, clearAll = true){
        this.#result = toShow.toString()
        if (clearAll) {
            this.#resultActive = false
            this.#currentNumber = ''
            const prev = document.querySelector('.calc-output-previous')
            if (prev != null) prev.remove()
        }else{
            this.#currentNumber = toShow
        }
        this.#previousNumber = ''
        this.#currentOperator = ''
        this.#updateOutput()
    }
}

class Operation{
    #number1
    #number2
    #operator

    constructor(num1, num2, op){
        this.#number1 = num1
        this.#number2 = num2
        this.#operator = op
    }

    getResult(){
        switch(this.#operator){
            case '+':
                return parseFloat(parseFloat(this.#number1) + parseFloat(this.#number2))
            case '-':
                return parseFloat(parseFloat(this.#number1) - parseFloat(this.#number2))
            case 'x':
                return parseFloat(parseFloat(this.#number1) * parseFloat(this.#number2))
            case '/':
                return parseFloat(parseFloat(this.#number1) / parseFloat(this.#number2))
            default:
                return 0
        }
    }
}