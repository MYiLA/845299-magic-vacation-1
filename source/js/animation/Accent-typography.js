export default class AccentTypography {
  constructor(
      elementSelector,
      timer,
      classForActivate,
      property,
      lettersOrders = [],
  ) {
    this._WORD_OFFSET_MULTIPLIER = 300;
    this._LETTER_OFFSET_MULTIPLIER = 50;

    this._elementSelector = elementSelector;
    this._timer = timer;
    this._classForActivate = classForActivate;
    this._property = property;
    this._lettersOrders = lettersOrders;
    this._element = document.querySelector(this._elementSelector);
    this._element.classList.add(`word-wrapper`);
    this._wordOffset = 0;
    this._currentWordLettersOrders = lettersOrders;

    this.prePareText();
  }

  createElement(letter, order = 0) {
    const span = document.createElement(`span`);
    const letterTimeOffset = this._wordOffset + (order * this._LETTER_OFFSET_MULTIPLIER);

    span.textContent = letter;
    span.style.transition = `${this._property} ${this._timer}ms cubic-bezier(.12,1.05,.52,1) ${letterTimeOffset}ms`;

    return span;
  }

  prePareText() {
    if (!this._element) {
      return;
    }

    const text = this._element.textContent.split(/( (?!\/|—|[0-9]))/).filter((latter)=>latter !== ` `);

    const content = text.reduce((fragmentParent, word, wordId) => {
      this._wordOffset = wordId * this._WORD_OFFSET_MULTIPLIER;

      if (text.length > 1) {
        this._currentWordLettersOrders = this._lettersOrders[wordId];
      }

      const wordElement = Array.from(word).reduce((fragment, letter, letterId) => {
        if (letter === ` `) {
          const lastLetterElement = fragment.lastElementChild;
          lastLetterElement.classList.add(`word-space-right`);
          return fragment;
        }
        fragment.appendChild(this.createElement(letter, this._currentWordLettersOrders[letterId]));
        return fragment;
      }, document.createDocumentFragment());

      const wordContainer = document.createElement(`div`);

      wordContainer.classList.add(`word`);
      wordContainer.appendChild(wordElement);
      fragmentParent.appendChild(wordContainer);

      return fragmentParent;
    }, document.createDocumentFragment());

    this._element.innerHTML = ``;
    this._element.appendChild(content);
  }

  runAnimation() {
    if (!this._element) {
      return;
    }

    this._element.classList.add(this._classForActivate);
  }

  destroyAnimation() {
    this._element.classList.remove(this._classForActivate);
  }
}
