class Form {
  constructor(id) {
    this.form = document.getElementById(id);
  }

  hideFieldErrors() {
    var errors = this.form.querySelectorAll('.error');
    for (let i = 0; i < errors.length; i++) {
      errors[i].innerHTML = '';
      errors[i].classList.remove('show');
    }
  }

  showFieldErrors(errors) {
    for (const name in errors) {
      const errMessage = this.form.querySelector('.error.' + name);
      errMessage.innerHTML = errors[name];
      errMessage.classList.add('show');
    }
  }
}

class DOMSelector {
  constructor(parent, selector) {
    this.elements = parent.querySelectorAll(selector);
  }

  html(html) {
    this._iter(e => {
      e.innerHTML = html;
    });
  }

  addClass(cl) {
    this._iter(e => {
      e.classList.add(cl);
    });
    return this;
  }

  _iter(callback) {
    for (let i = 0; i < this.elements.length; i++) {
      callback(this.elements[i]);
    }
  }
}

class Http {
  constructor() {
    this.params = this._getUrlParams();
  }

  _getUrlParams() {
    const params = {};

    const query = window.location.search.substr(1).split('&');
    for (let i = 0; i < query.length; i++) {
      const param = query[i].split('=');
      params[ decodeURIComponent(param[0]) ] = decodeURIComponent(param[1]);
    }

    return params;
  }

  api(endpoint) {
    const api = new API(endpoint);
    api.header('x-access-token', cookieManager.get('token'));
    return api;
  }

  redirect(url) {
    window.location = url;
  }
}

const cookieManager = {
  set(name, value) {
    const d = new Date();
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    const expires = d.toUTCString();

    document.cookie = `${name}=${value};expires=${expires};path=/`;
  },

  get(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookieVar = cookies[i].split('=');
      if (cookieVar[0] == name) {
      	return cookieVar[1];
      }
    }
  },

  delete(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  },
};

const app = {
  auth: {
    required: false,
    redirect: false,
  },

  dom: {
    selector(selector) {
      return new DOMSelector(document, selector);
    }
  },

  setAuthRequired(required, redirect=false) {
    this.auth = { required, redirect };
  },

  setAuthToken(token) {
  	cookieManager.set('token', token);
  },

  logout() {
    cookieManager.delete('token');
  },

  ready(callback) {
    this.readyCallback = callback;
  },

  start() {
    const token = cookieManager.get('token');
    if (this.auth.required) {
      if (!token) {
      	window.location = './login.html';
      	return;
      }
    } else if (token && this.auth.redirect) {
      	window.location = './dashboard.html';
      	return;
    }

    if (typeof app.readyCallback === 'function') {
  	  window.addEventListener('load', (e) => {
  	    app.readyCallback(new Http());
  	  });
    }
  },

  form(id) {
    return new Form(id);
  },
};
