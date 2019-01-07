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
