/**
 * @author Daniel Austin
 */

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

  field(name) {
    const element = this.form.elements[name];
    return {
      element,
      value() {
        if (arguments.length > 0) {
          this.element.value = arguments[0];
        } else {
          return this.element.value;
        }
      },
    };
  }

  onsubmit(callback) {
    const instance = this;
    this.form.onsubmit = (event) => {
      callback(event, instance);
    };
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

  click(callback) {
    this._iter(e => {
      e.onclick = callback;
    });
  }

  addClass(cl) {
    this._iter(e => {
      e.classList.add(cl);
    });
    return this;
  }

  hide() {
    this._iter((e) => {
      e.style.display = 'none';
    });
  }

  show() {
    this._iter((e) => {
      e.style.display = 'block';
    });
  }

  showInline() {
    this._iter((e) => {
      e.style.display = 'inline';
    });
  }

  _iter(callback) {
    for (let i = 0; i < this.elements.length; i++) {
      callback(this.elements[i]);
    }
  }
}

class Table {
  constructor(id) {
    this.table = document.getElementById(id);
    this.dataSet = [];
    this.rowView = null;
  }

  setDataSet(dataSet) {
    this.dataSet = dataSet;
    return this;
  }

  setRowView(view) {
    this.rowView = view;
  }

  dataAt(index) {
    return this.dataSet[index];
  }

  remove(index) {
    this.dataSet.splice(index, 1);
    this.draw();
  }

  draw() {
    let buffer = '';
    for (let i = 0, serialCounter = 1; i < this.dataSet.length; i++, serialCounter++) {
      buffer += this.rowView(this.dataSet[i], serialCounter, i);
    }
    this.table.querySelector('tbody').innerHTML = buffer;
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

  baseUrl(path=null) {
    let baseUrl = window.location.protocol.concat('//').concat(window.location.host);
    return path ? baseUrl.concat('/').concat(path) : baseUrl;
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
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  },
};

class Toast {
  constructor(className, text) {
    this.toast = document.createElement('div');
    this.toast.setAttribute('class', 'toast no-select');
    this.toast.classList.add(className);
    this.toast.innerHTML = text;

    this.isShown = false;
  }

  show() {
    document.body.appendChild(this.toast);

    this.isShown = true;

    const _this = this;
    this.timeoutId = setTimeout(() => {
      _this.hide();
    }, 2500);
  }

  hide() {
    if (this.isShown) {
      clearTimeout(this.timeoutId);

      document.body.removeChild(this.toast);
      
      this.isShown = false;
    }
  }
}

class Preloader {
  constructor(id) {
    this.container = document.querySelector(`.preload#${id}`);
  }

  hideLoadingAnimation(callback=null) {
    this.container.querySelector('.loader').style.display = 'none';
    this.container.querySelector('.on-load').style.display = 'block';

    if (typeof callback == 'function') {
      callback();
    }
  }
}

const app = {

  externals: {
    'mapbox': {
      js: 'https://api.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.js',
      css: 'https://api.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css'
    }
  },
  using: [],
  
  use(library) {
    this.using.push(library);
  },
  
  auth: {
    required: false,
    redirect: false,
  },

  dom: {
    selector(selector) {
      return new DOMSelector(document, selector);
    }
  },

  toast: {
    current: null,

    success(text) {
      this.show('green', text);
    },

    error(text) {
      this.show('red', text);
    },

    show(className, text) {
      if (this.current) {
        this.current.hide();
      }

      this.current = new Toast(className, text);
      this.current.show();
    }
  },

  http: new Http(),

  setAuthRequired(required, redirect=false) {
    this.auth = { required, redirect };
  },

  setAuthToken(token) {
  	cookieManager.set('token', token);
  },

  logout() {
    cookieManager.delete('token');
    app.http.redirect(app.http.baseUrl());
  },

  setTitle(title) {
    document.title = title;
  },

  ready(callback) {
    this.readyCallback = callback;
  },

  start() {
    const token = cookieManager.get('token');
    if (this.auth.required) {
      if (!token) {
      	window.location = this.http.baseUrl('login.html');
      	return;
      }
    } else if (token && this.auth.redirect) {
      	window.location = this.http.baseUrl('dashboard.html');
      	return;
    }

    // Load externals
    for (let i = 0; i < this.using.length; i++) {
      const ext = this.externals[this.using[i]];

      if (typeof ext['js'] !== 'undefined') {
        const js = document.createElement('script');
        js.async = false;
        js.setAttribute('src', ext['js']);
        document.head.appendChild(js);
      }
      
      if (typeof ext['css'] !== 'undefined') {
        const css = document.createElement('link');
        css.setAttribute('href', ext['css']);
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('type', 'text/css');
        document.head.appendChild(css);
      }
    }

    if (typeof app.readyCallback === 'function') {
  	  window.addEventListener('load', (e) => {
  	    app.readyCallback(new Http(), app.dom);
  	  });
    }
  },

  form(id) {
    return new Form(id);
  },

  tables: {},

  table(id) {
    if (typeof this.tables[id] !== 'undefined') {
      return this.tables[id];
    } else {
      const table = new Table(id);
      this.tables[id] = table;
      return table;
    }
  },

  preloader(id) {
    return new Preloader(id);
  }
};


/**
 * Mapbox
 */
class Mapbox {
  /**
   * {string} id The id of the container to display the map.
   * {array} coords The coordinates in the format [lng, lat].
   */
  constructor(id, coords) {
    this.coords = coords;

    mapboxgl.accessToken = 'pk.eyJ1IjoiZGFubnltYXBzIiwiYSI6ImNqbGh4cDFnczA3dDUzcG15N2lybDczYWMifQ.g4l-gTR_N48LYnFcevdw0A';
    this.map = new mapboxgl.Map({
      container: id,
      style: 'mapbox://styles/mapbox/streets-v9',
      center: coords,
      zoom: 9
    });

    this.addMarker();
  }

  addMarker() {
    new mapboxgl.Marker().setLngLat(this.coords).addTo(this.map);
  }
}

app.mapbox = (id, coords) => {
  new Mapbox(id, coords);
};
