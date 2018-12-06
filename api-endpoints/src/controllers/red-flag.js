import load from '../helpers/loader';
import response from '../helpers/response';
import Model from '../models/model';
import Validator from '../helpers/validator';

export default class RedFlag {
  constructor() {
    this.model = new Model('incidents');
  }

  add(type, req) {
    const validator = new Validator(req.body);
    const rules = {
      title: ['required'],
      comment: ['required']
    };
    if (validator.validate(rules)) {
      const { title, comment, lat, long } = req.body;

      const id = this.model.insert({
      	'createdOn': new Date(),
      	'createdBy': 2,
      	'title': title,
      	'status': 'draft',
      	'comment': comment,
      	'location': lat && long ? lat + ', ' + long : null,
      	'type': type
      });
      return response.success({
      	'id': id,
      	'message': 'Created red-flag record'
      });
    } else {
      return response.fail(validator.getErrors());
    }
  }

  getAll(type) {
    const redFlags = this.model.init().where('type', type).get();
    return response.success(redFlags);
  }

  get(type, id) {
  	const redFlag = this.model.init().where('type', type).where('id', id).first();
    return redFlag ? response.success(redFlag) : response.fail('Record not found');
  }
}
