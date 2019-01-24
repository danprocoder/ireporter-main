class Dropdown {
  constructor(element) {
    this.element = element;
    this.menus = element.getElementsByClassName('dropdown-menu')[0] || null;

    const o = this;
    this.element.addEventListener('click', (ev) => {
      o.menus.style.display = 'block';

      return false;
    });

    this.class = {
      add(className) {
        element.classList.add(className);
        return this;
      },

      remove(className) {
        if (!(className instanceof Array)) {
          className = [className];
        }
        
        for (let i = 0; i < className.length; i++) {
          element.classList.remove(className[i]);
        }
        return this;
      }
    };
  }

  onMenuClicked(callback) {
    const menus = this.menus.querySelectorAll('ul li a');
    for (let i = 0; i < menus.length; i++) {
      menus[i].onclick = (e) => {
        callback(i);

        e.stopPropagation();
        e.preventDefault();
      };
    }
  }

  child(query) {
    return new DOMSelector(this.element, query);
  }

  getId() {
    return this.element.id;
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
    this.id = id;

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

  getId() {
    return this.id;
  }
}

class QuestionModal extends Modal {
  onYes(callback) {
    this.modal.querySelector('.modal-btn.yes').onclick = callback;
  }
}

const elements = [];
function $(id) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].getId() == id) {
      return elements[i];
    }
  }
}

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
