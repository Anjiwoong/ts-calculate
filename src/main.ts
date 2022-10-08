import './style.css';

type Operator = '+' | '-' | '×' | '÷' | '=';
type ComputedValue = {
  [key in Exclude<Operator, '='>]: (num1: number, num2: number) => number;
};

interface CalculatorInterface {
  tempValue: string | number;
  tempOperator?: Operator | string;
  render(inputValue: string | number): void;
  reset(): void;
  calculate(operator: Operator | string): void;
  initEvent(): void;
}

const VALID_NUMBER_OF_DIGITS = 3;
const INIT_VALUE = 0;
const OPERATORS = ['+', '-', '×', '÷'];

const validateNumberLength = (value: string | number) => {
  return String(value).length < VALID_NUMBER_OF_DIGITS;
};

const isZero = (value: string) => Number(value) === 0;

const getComputedValue: ComputedValue = {
  '+': (num1, num2) => num1 + num2,
  '-': (num1, num2) => num1 - num2,
  '×': (num1, num2) => num1 * num2,
  '÷': (num1, num2) => num1 / num2,
};

const Calculator: CalculatorInterface = {
  tempValue: 0,
  tempOperator: undefined,

  render(inputValue: string | number) {
    const $result = <HTMLDivElement>document.getElementById('result');
    const prevValue = $result.innerText;

    if (!validateNumberLength(prevValue)) {
      alert('3자리 이상의 숫자를 입력할 수 없습니다.');
      return;
    }

    if ($result) {
      $result.innerText = isZero(prevValue)
        ? String(inputValue)
        : String(prevValue + inputValue);
    }
  },

  reset() {
    const $result = <HTMLDivElement>document.querySelector('#result');

    $result.innerText = String(INIT_VALUE);
    this.tempValue = INIT_VALUE;
    this.tempOperator = undefined;
  },

  calculate(operator: Operator | string) {
    const isReadyCalculated =
      operator === '=' &&
      this.tempOperator &&
      OPERATORS.includes(this.tempOperator);
    const isTempCalculated = OPERATORS.includes(operator);

    if (isTempCalculated) {
      const $result = <HTMLDivElement>document.querySelector('#result');

      this.tempOperator = operator;
      this.tempValue = +$result.innerText;

      $result.innerText = String(INIT_VALUE);

      return;
    }

    if (isReadyCalculated) {
      const $result = <HTMLDivElement>document.querySelector('#result');

      const resultValue = getComputedValue[
        this.tempOperator as Exclude<Operator, '='>
      ](+this.tempValue, +$result.innerText);

      $result.innerText = String(resultValue);
    }
  },

  initEvent() {
    const buttonContainerEl = document.querySelector('.contents');

    buttonContainerEl?.addEventListener('click', ({ target }) => {
      const buttonText = (target as HTMLButtonElement).innerText;

      if (buttonText === 'AC') {
        this.reset();

        return;
      }

      if (OPERATORS.concat('=').includes(buttonText)) {
        this.calculate(buttonText);

        return;
      }

      if (!Number.isNaN(buttonText)) {
        this.render(+buttonText);
      }
    });
  },
};

Calculator.render(INIT_VALUE);
Calculator.initEvent();
