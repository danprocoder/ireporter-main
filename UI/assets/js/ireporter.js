class Dropdown {
  constructor(element) {
    this.element = element;
    this.menus = element.getElementsByClassName('dropdown-menu')[0] || null;

    const o = this;
    this.element.addEventListener('click', (ev) => {
      o.menus.style.display = 'block';

      return false;
    });
  }

  close() {
    this.menus.style.display = 'none';
  }

  isClicked(src) {
    return src.isEqualNode(this.element) || this.element.contains(src);
  }
}

class Modal {
  constructor(id) {
    this.container = document.querySelector('.modal-container');
    this.modal = this.container.querySelector(`.modal#${id}`);

    const obj = this;
    this.modal.querySelector('.close').onclick = (event) => {
      obj.hide();
    };
  }

  show() {
    this.container.style.display = 'block';
    this.modal.style.display = 'block';
  }

  hide() {
    this.modal.style.display = 'none';
    this.container.style.display = 'none';
  }
}

class QuestionModal extends Modal {
  onYes(callback) {
    this.modal.querySelector('.modal-btn.yes').onclick = callback;
  }
}

const elements = [];

const classMap = {
  dropdown: Dropdown,
};

window.addEventListener('load', () => {
  for (const k in classMap) {
    const r = document.getElementsByClassName(k);
    for (let i = 0; i < r.length; i++) {
      elements.push(new classMap[k](r[i]));
    }
  }
});

// Close opened elements on click outside.
document.addEventListener('click', (ev) => {
  for (let i = 0; i < elements.length; i++) {
    const e = elements[i];
    if (!e.isClicked(ev.target)) {
      e.close();
    }
  }
});
