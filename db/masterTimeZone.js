const debug = require("debug")("evolvus-master-time-zone:db:masterTimeZone");
const mongoose = require("mongoose");
const ObjectId = require('mongodb')
  .ObjectID;

const masterTimeZoneSchema = require("./masterTimeZoneSchema");

// Creates a masterTimeZoneCollection collection in the database
var masterTimeZoneCollection = mongoose.model("masterTimeZoneCollection", masterTimeZoneSchema);

// Saves the masterTimeZoneCollection object to the database and returns a Promise
// The assumption here is that the Object is valid
module.exports.save = (object) => {
  return new Promise((resolve, reject) => {
    try {
      // any exception during construction will go to catch
      let masterTimeZone = new masterTimeZoneCollection(object);
      // on resolve we need to resolve the this method
      // on reject or exception we reject it,
      // this is because the record either saves or it doesnt
      // in any case it does not save, is a reject
      masterTimeZone.save()
        .then((data) => {
          debug("saved successfully", data._id);
          resolve(data);
        }, (err) => {
          debug(`rejected save.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on save: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};


// Returns a limited set if all the masterTimeZone(s) with a Promise
// if the collectiom has no records it Returns
// a promise with a result of  empty object i.e. {}
module.exports.findAll = (limit) => {
  if (limit < 1) {
    return masterTimeZoneCollection.find({});
  }
  return masterTimeZoneCollection.find({}).limit(limit);
};

// Finds the masterTimeZone which matches the value parameter from masterTimeZone collection
// If there is no object matching the attribute/value, return empty object i.e. {}
// null, undefined should be rejected with Invalid Argument Error
// Should return a Promise
module.exports.findOne = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      var query = {};
      query[attribute] = value;
      masterTimeZoneCollection.findOne(query)
        .then((data) => {
          debug(`masterTimeZone found ${data}`);
          resolve(data);
        }, (err) => {
          debug(`rejected find.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on find: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

// Finds all the masterTimeZones which matches the value parameter from masterTimeZone collection
// If there is no object matching the attribute/value, return empty object i.e. {}
// null, undefined should be rejected with Invalid Argument Error
// Should return a Promise
module.exports.findMany = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      var query = {};
      query[attribute] = value;
      masterTimeZoneCollection.find(query)
        .then((data) => {
          debug(`masterTimeZone found ${data}`);
          resolve(data);
        }, (err) => {
          debug(`rejected find.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on find: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

// Finds the masterTimeZone for the id parameter from the masterTimeZone collection
// If there is no object matching the id, return empty object i.e. {}
// null, undefined, invalid objects should be rejected with Invalid Argument Error
// All returns are wrapped in a Promise
//
module.exports.findById = (id) => {
  return new Promise((resolve, reject) => {
    try {
      masterTimeZoneCollection.findById({
          _id: new ObjectId(id)
        })
        .then((res) => {
          debug("findById successfull: ", res);
          resolve(res);
        }, (err) => {
          debug(`rejected finding masterTimeZoneCollection.. ${err}`);
          reject(err);
        })
        .catch((e) => {
          debug(`exception on finding masterTimeZone: ${e}`);
          reject(e);
        });
    } catch (e) {
      debug(`caught exception: ${e}`);
      reject(e);
    }
  });
};

// Deletes all the entries of the collection.
// To be used by test only
module.exports.deleteAll = () => {
  return masterTimeZoneCollection.remove({});
};