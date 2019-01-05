const cookieManager = {
  set(name, value) {
	var d = new Date();
	d.setTime(d.getTime() + (30*24*60*60*1000));
	var expires = d.toUTCString();
	
	document.cookie = `${name}=${value};expires=${expires};path=/`;
  },

  get(name) {
    var cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookieVar = cookies[i].split('=');
      if (cookieVar[0] == name) {
      	return cookieVar[1];
      }
    }
  },

  delete(name) {
   document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
};

const app = {
  auth: {
    required: false,
    redirect: false
  },
  
  setAuthRequired(required, redirect) {
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
    } else {
      if (token && this.auth.redirect) {
      	window.location = './dashboard.html';
      	return;
      }
    }

    if (typeof app.readyCallback == 'function') {
  	  window.addEventListener('load', (e) => {
  	    app.readyCallback({
  	      api(endpoint) {
  	      	return new API(endpoint);
  	      },

  	      redirect(url) {
  	      	window.location = url;
  	      }
  	    });
  	  });
    }
  }
};
