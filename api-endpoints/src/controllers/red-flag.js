import load from '../helpers/loader';
import response from '../helpers/response';
import Model from '../models/model';

export default class RedFlag {
  constructor() {
    this.model = new Model('red-flags');
  }

  getAll() {
    const redFlags = this.model.get();
    return response.success(redFlags);
  }

  get(id) {
  	const redFlag = this.model.init().where('id', id).first();
    return redFlag ? response.success(redFlag) : response.fail('Record not found');
  }
}
