const debug = require("debug")("evolvus-master-time-zone:index");
const masterTimeZoneSchema = require("./model/masterTimeZoneSchema")
  .schema;
const masterTimeZoneCollection = require("./db/masterTimeZone");
const validate = require("jsonschema")
  .validate;
const docketClient = require("evolvus-docket-client");
const masterTimeZoneDBSchema = require('./db/masterTimeZoneSchema');

var docketObject = {
  // required fields
  application: "PLATFORM",
  source: "masterTimeZone",
  name: "",
  createdBy: "",
  ipAddress: "",
  status: "SUCCESS", //by default
  eventDateTime: Date.now(),
  keyDataAsJSON: "",
  details: "",
  //non required fields
  level: ""
};

module.exports.masterTimeZone = {
  masterTimeZoneSchema,
  masterTimeZoneDBSchema
};
module.exports.validate = (masterTimeZoneObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterTimeZoneObject === "undefined") {
        throw new Error("IllegalArgumentException:masterTimeZoneObject is undefined");
      }
      var res = validate(masterTimeZoneObject, masterTimeZoneSchema);
      debug("validation status: ", JSON.stringify(res));
      if (res.valid) {
        resolve(res.valid);
      } else {
        reject(res.errors);
      }
    } catch (err) {
      reject(err);
    }
  });
};

// All validations must be performed before we save the object here
// Once the db layer is called its is assumed the object is valid.
module.exports.save = (masterTimeZoneObject) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof masterTimeZoneObject === 'undefined' || masterTimeZoneObject == null) {
        throw new Error("IllegalArgumentException: masterTimeZoneObject is null or undefined");
      }
      docketObject.name = "masterTimeZone_save";
      docketObject.keyDataAsJSON = JSON.stringify(masterTimeZoneObject);
      docketObject.details = `masterTimeZone creation initiated`;
      docketClient.postToDocket(docketObject);
      var res = validate(masterTimeZoneObject, masterTimeZoneSchema);
      debug("validation status: ", JSON.stringify(res));
      if (!res.valid) {
        reject(res.errors);
      }

      // Other validations here


      // if the object is valid, save the object to the database
      masterTimeZoneCollection.save(masterTimeZoneObject).then((result) => {
        debug(`saved successfully ${result}`);
        resolve(result);
      }).catch((e) => {
        debug(`failed to save with an error: ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "masterTimeZone_ExceptionOnSave";
      docketObject.keyDataAsJSON = JSON.stringify(masterTimeZoneObject);
      docketObject.details = `caught Exception on masterTimeZone_save ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

// List all the objects in the database
// makes sense to return on a limited number
// (what if there are 1000000 records in the collection)
module.exports.getAll = (limit) => {
  return new Promise((resolve, reject) => {
    try {
      if (typeof(limit) == "undefined" || limit == null) {
        throw new Error("IllegalArgumentException: limit is null or undefined");
      }
      docketObject.name = "masterTimeZone_getAll";
      docketObject.keyDataAsJSON = `getAll with limit ${limit}`;
      docketObject.details = `masterTimeZone getAll method`;
      docketClient.postToDocket(docketObject);

      masterTimeZoneCollection.findAll(limit).then((docs) => {
        debug(`masterTimeZone(s) stored in the database are ${docs}`);
        resolve(docs);
      }).catch((e) => {
        debug(`failed to find all the master-time-zone(s) ${e}`);
        reject(e);
      });
    } catch (e) {
      docketObject.name = "masterTimeZone_ExceptionOngetAll";
      docketObject.keyDataAsJSON = "masterTimeZoneObject";
      docketObject.details = `caught Exception on masterTimeZone_getAll ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};


// Get the entity idenfied by the id parameter
module.exports.getById = (id) => {
  return new Promise((resolve, reject) => {
    try {

      if (typeof(id) == "undefined" || id == null) {
        throw new Error("IllegalArgumentException: id is null or undefined");
      }
      docketObject.name = "masterTimeZone_getById";
      docketObject.keyDataAsJSON = `masterTimeZoneObject id is ${id}`;
      docketObject.details = `masterTimeZone getById initiated`;
      docketClient.postToDocket(docketObject);

      masterTimeZoneCollection.findById(id)
        .then((res) => {
          if (res) {
            debug(`masterTimeZone found by id ${id} is ${res}`);
            resolve(res);
          } else {
            // return empty object in place of null
            debug(`no masterTimeZone found by this id ${id}`);
            resolve({});
          }
        }).catch((e) => {
          debug(`failed to find masterTimeZone ${e}`);
          reject(e);
        });

    } catch (e) {
      docketObject.name = "masterTimeZone_ExceptionOngetById";
      docketObject.keyDataAsJSON = `masterTimeZoneObject id is ${id}`;
      docketObject.details = `caught Exception on masterTimeZone_getById ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getOne = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "masterTimeZone_getOne";
      docketObject.keyDataAsJSON = `masterTimeZoneObject ${attribute} with value ${value}`;
      docketObject.details = `masterTimeZone getOne initiated`;
      docketClient.postToDocket(docketObject);
      masterTimeZoneCollection.findOne(attribute, value).then((data) => {
        if (data) {
          debug(`masterTimeZone found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no masterTimeZone found by this ${attribute} ${value}`);
          resolve({});
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "masterTimeZone_ExceptionOngetOne";
      docketObject.keyDataAsJSON = `masterTimeZoneObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on masterTimeZone_getOne ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};

module.exports.getMany = (attribute, value) => {
  return new Promise((resolve, reject) => {
    try {
      if (attribute == null || value == null || typeof attribute === 'undefined' || typeof value === 'undefined') {
        throw new Error("IllegalArgumentException: attribute/value is null or undefined");
      }

      docketObject.name = "masterTimeZone_getMany";
      docketObject.keyDataAsJSON = `masterTimeZoneObject ${attribute} with value ${value}`;
      docketObject.details = `masterTimeZone getMany initiated`;
      docketClient.postToDocket(docketObject);
      masterTimeZoneCollection.findMany(attribute, value).then((data) => {
        if (data) {
          debug(`masterTimeZone found ${data}`);
          resolve(data);
        } else {
          // return empty object in place of null
          debug(`no masterTimeZone found by this ${attribute} ${value}`);
          resolve([]);
        }
      }).catch((e) => {
        debug(`failed to find ${e}`);
      });
    } catch (e) {
      docketObject.name = "masterTimeZone_ExceptionOngetMany";
      docketObject.keyDataAsJSON = `masterTimeZoneObject ${attribute} with value ${value}`;
      docketObject.details = `caught Exception on masterTimeZone_getMany ${e.message}`;
      docketClient.postToDocket(docketObject);
      debug(`caught exception ${e}`);
      reject(e);
    }
  });
};