class API {
  constructor(url) {
    this.endpoint = url;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  header(key, value) {
  	this.headers[key] = value;
  }

  body(body) {
    this.body = body;
    return this;
  }

  patch(success, error) {
	  this._fetch('PATCH', success, error);
  }

  get(success, error) {
	  this._fetch('GET', success, error);
  }

  post(success, error) {
	  this._fetch('POST', success, error);
  }

  delete(success, error) {
	  this._fetch('DELETE', success, error);
  }

  _fetch(method, success, error) {
    this.fetch = fetch(`https://daniel-ireporter.herokuapp.com/api/v1/${this.endpoint}`, {
      method,
      headers: this.headers,
      body: JSON.stringify(this.body),
    }).then(res => res.json()).then((data) => {
      if (data.status == 200) {
	    success(data.data);
      } else {
        error(data);
      }
    }).catch((e) => {
      error(e);
    });
  }
}
