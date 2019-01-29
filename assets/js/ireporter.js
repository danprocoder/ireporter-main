class Element {
  constructor(element) {
    this.element = element;
  }

  getId() {
    return this.element.id;
  }

  child(query) {
    return new DOMSelector(this.element, query);
  }

  isClicked(src) {
    return src.isEqualNode(this.element) || this.element.contains(src);
  }
}

class Dropdown extends Element {
  constructor(element) {
    super(element);

    this.menus = element.getElementsByClassName('dropdown-menu')[0] || null;

    const o = this;
    this.element.addEventListener('click', (ev) => {
      if (!o.disabled) {
        o.menus.style.display = 'block';
      }

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
      },
    };

    this.disabled = false;
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

  disable(disabled) {
    this.disabled = disabled;
    return this;
  }

  close() {
    this.menus.style.display = 'none';
  }
}

class Tab extends Element {
  constructor(element) {
    super(element);

    this.tabMenus = element.querySelectorAll('.tab li a');
    this.tabPanes = element.querySelectorAll('.tab-content .tab-pane');

    this.currentTabIndex = -1;

    this.initTabs();
  }

  initTabs() {
    for (let i = 0; i < this.tabMenus.length; i++) {
      // Set tab menu click listener.
      const menu = this.tabMenus[i];
      const o = this;
      menu.addEventListener('click', (e) => {
        // Remove existing active class.
        for (let j = 0; j < o.tabMenus.length; j++) {
          o.tabMenus[j].parentNode.classList.remove('active');
        }

        menu.parentNode.classList.add('active');

        o.showTabContent(i);

        // Fire tab changed listener.
        if (o.currentTabIndex !== i && typeof o.tabChangedCallback === 'function') {
          o.tabChangedCallback(i);
        }
        o.currentTabIndex = i;

        e.preventDefault();
      });

      // Default active tab.
      if (menu.parentNode.classList.contains('active')) {
        this.showTabContent(i);

        this.currentTabIndex = i;
      }
    }
  }

  showTabContent(index) {
    // Hide all tab panes
    for (let i = 0; i < this.tabPanes.length; i++) {
      this.tabPanes[i].style.display = 'none';
    }

    this.tabPanes[index].style.display = 'block';
  }

  onTabChanged(callback) {
    this.tabChangedCallback = callback;
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

let elements = [];
function $(id) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].getId() == id) {
      return elements[i];
    }
  }
}

const classMap = {
  dropdown: Dropdown,
  'tab-container': Tab,
};

initElements = () => {
  elements = [];

  for (const k in classMap) {
    const r = document.getElementsByClassName(k);
    for (let i = 0; i < r.length; i++) {
      elements.push(new classMap[k](r[i]));
    }
  }
};

window.addEventListener('load', () => {
  initElements();
});

// Close opened elements on click outside.
document.addEventListener('click', (ev) => {
  for (let i = 0; i < elements.length; i++) {
    const e = elements[i];
    if (!e.isClicked(ev.target) && typeof e.close === 'function') {
      e.close();
    }
  }
});
