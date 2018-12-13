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
        required: 'Title is required',
      },
      comment: {
        required: 'Comment is required',
        'min_length[40]': 'Comment should be atleast 40 characters long',
      },
      lat: {
        optional: true,
        latitude: 'Latitude must be between -90 and 90',
      },
      long: {
        optional: true,
        longitude: 'Longitude must be between -180 and 180',
      }
    };

    if (validator.validate(rules)) {
      const { title, comment, lat, long } = req.body;

      this.model.insert({
      	createdBy: req.loggedInUser.id,
      	title,
      	comment,
        latitude: lat && long ? lat : null,
        longitude: lat && long ? long : null,
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
          res.status(403).json(response.fail('Record was not created by you'));
        } else {
          res.status(200).json(response.success(row));
        }
      } else {
        res.status(404).json(response.notFound('Record not found'));
      }
    });
  }

  update(req, res) {
    const validator = new Validator(req.body);
    const rules = {
      title: {
        required: 'Title is required',
      },
      comment: {
        required: 'Comment is required',
        'min_length[40]': 'Comment should be atleast 40 characters long',
      },
      lat: {
        optional: true,
        latitude: 'Latitude must be between -90 and 90',
      },
      long: {
        optional: true,
        longitude: 'Longitude must be between -180 and 180',
      }
    };

    const type = this.type;
    const model = this.model;
    
    model.readOneById(type, req.params.id, (row) => {
      if (!row) {
        res.status(404).json(response.notFound('Record not found'));
      } else if (row.createdby != req.loggedInUser.id) {
        res.status(403).json(response.fail('Access forbidden'));
      } else {
        if (validator.validate(rules)) {
          const { title, comment, lat, long } = req.body;

          model.update(type, req.params.id, {
            title,
            comment,
            latitude: lat && long ? lat : null,
            longitude: lat && long ? long : null
          }, () => {
            res.status(200).json(response.success({
              id: req.params.id,
              message: `Updated ${type} record`,
            }));
          });
        } else {
          res.status(400).json(response.fail(validator.getErrors()));
        }
      }
    });
  }

  updateStatus(req, res) {
    const model = this.model;
    const type = this.type;

    model.readOneById(type, req.params.id, (row) => {
      if (!row) {
        res.status(404).json(response.notFound('Record does not exists'));
      } else {
        if (['in-draft', 'under-investigation', 'resolved', 'rejected'].indexOf(req.body.status) == -1) {
          res.status(400).json(response.fail(`Status can either be 'in-draft', 'under-investigation', 'resolved' or 'rejected'`));
        } else {
          model.updateStatus(type, req.params.id, req.body.status, () => {
            res.status(200).json(response.success({
              id: req.params.id,
              message: `Updated ${type} record status`,
            }));
          });
        }
      }
    });
  }
  
  delete(req, res) {
    const model = this.model;
    const type = this.type;

    model.readOneById(type, req.params.id, (row) => {
      if (!row) {
        res.status(404).json(response.notFound('Record not found'));
      } else if (row.createdby != req.loggedInUser.id) { // Only the creator of the record can delete the record.
        res.status(400).json(response.fail('Access forbidden'));
      } else {
        model.deleteById(type, req.params.id, () => {
          res.status(200).json(response.success({
            id: req.params.id,
            message: `${type} record has been deleted`,
          }));
        });
      }
    });
  }
}
