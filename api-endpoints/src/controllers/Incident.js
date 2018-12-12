import load from '../helpers/loader';
import response from '../helpers/response';
import IncidentModel from '../models/Incident';
import Validator from '../helpers/validator';

export default class Incident {
  constructor(type) {
    this.type = type;
    this.model = new IncidentModel();
  }

  add(req, res) {
    const validator = new Validator(req.body);
    const rules = {
      title: {
        required: 'Title is required'
      },
      comment: {
        required: 'Comment is required',
        'min_length[40]': 'Comment should be atleast 40 characters long'
      },
      lat: {
        optional: true,
        latitude: 'Latitude must be between -90 and 90'
      },
      long: {
        optional: true,
        longitude: 'Longitude must be between -180 and 180'
      }
    };

    if (validator.validate(rules)) {
      const { title, comment, lat, long } = req.body;

      this.model.insert({
      	createdBy: req.loggedInUser.id,
      	title,
      	comment,
        latitude: lat ? lat : null,
        longitude: long ? long : null,
      	type: this.type
      }, (row) => {
        res.status(200).json(response.success({
          id: row.id,
          message: `Created ${this.type} record`
        }));
      });
    } else {
      res.status(400).json(response.fail(validator.getErrors()));
    }
  }
  
  /**
   * Sends all incident records created on the platform if the user is an admin else it 
   * send backs only the records created by the user.
   * 
   * @param {*} req 
   * @param {*} res 
   */
  getAll(req, res) {
    const filters = {};
    if (!req.loggedInUser.isadmin) {
      filters.createdBy = req.loggedInUser.id;
    }
    this.model.read(this.type, filters, (rows) => {
      res.status(200).json(response.success(rows));
    });
  }

  get(req, res) {
    this.model.readOneById(this.type, req.params.id, (row) => {
      if (row) {
        // If user is not an admin, they can only fetch their own record.
        if (!req.loggedInUser.isadmin && row.createdby != req.loggedInUser.id) {
          res.status(400).json(response.fail('Record was not created by you'));
        } else {
          res.status(200).json(response.success(row));
        }
      } else {
        res.status(404).json(response.notFound('Record not found'));
      }
    });
  }

  update(type, id, reqBody) {
    // Check if ID exists.
    if (this.model.init().where('id', id).where('type', type).first() == null) {
      return response.fail('Record not found');
    }

    const validator = new Validator(reqBody);
    const rules = {
      title: {
        required: 'Title is required'
      },
      comment: {
        required: 'Comment is required',
        'min_length[40]': 'Comment should be atleast 40 characters long'
      },
      lat: {
        optional: true,
        latitude: 'Latitude must be between -90 and 90'
      },
      long: {
        optional: true,
        longitude: 'Longitude must be between -180 and 180'
      }
    };

    if (validator.validate(rules)) {
      const { title, comment, lat, long } = reqBody;
      this.model.init().where('id', id).where('type', type).update({
        title,
        comment,
        location: lat && long ? lat + ', ' + long : null
      });

      return response.success({
        id,
        message: 'Updated red-flag record'
      });
    } else {
      return response.fail(validator.getErrors());
    }
  }
  
  delete(type, id) {
    if (this.model.init().where('type', type).where('id', id).first() == null) {
      return response.fail('Record not found');
    }

    this.model.init().where('type', type).where('id', id).delete();
    return response.success({
      id,
      message: 'red-flag record has been deleted'
    });
  }
}
