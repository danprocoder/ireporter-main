class API {
  constructor(url) {
    this.endpoint = url;
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
    this.fetch = fetch(`/api/v1/${this.endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.body),
    }).then(res => res.json()).then((data) => {
      if (data.status == 200) {
	        	success(data.data);
      } else {
        error();
      }
    }).catch(() => {
      error();
    });
  }
}
