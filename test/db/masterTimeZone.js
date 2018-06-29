const debug = require("debug")("evolvus-master-time-zone.test.db.masterTimeZone");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const expect = chai.expect;
const masterTimeZone = require("../../db/masterTimeZone");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";

chai.use(chaiAsPromised);

// High level wrapper
// Testing db/masterTimeZone.js
describe("db masterTimeZone testing", () => {
  /*
   ** Before doing any tests, first get the connection.
   */
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  let object1 = {
    // add a valid masterTimeZone object
    "tenantId": "Obj1",
    "zoneCode": "IST",
    "zoneName": "ASIA",
    "offsetValue": "offone",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "offSet": "set",
    "objVersion": 123,
    "enableFlag": "1"
  };
  let object2 = {
    // add a valid masterTimeZone object
    "tenantId": "Obj2",
    "zoneCode": "IST",
    "zoneName": "ASIA",
    "offsetValue": "offtwo",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "offSet": "set",
    "objVersion": 123,
    "enableFlag": "1"
  };

  describe("testing masterTimeZone.save", () => {
    // Testing save
    // 1. Valid masterTimeZone should be saved.
    // 2. Non masterTimeZone object should not be saved.
    // 3. Should not save same masterTimeZone twice.
    beforeEach((done) => {
      masterTimeZone.deleteAll()
        .then((data) => {
          done();
        });
    });

    it("should save valid masterTimeZone to database", (done) => {
      let testmasterTimeZoneCollection = {
        // add a valid masterTimeZone object
        "tenantId": "master",
        "zoneCode": "IST",
        "zoneName": "ASIA",
        "offsetValue": "mastertwo",
        "createdDate": new Date().toISOString(),
        "lastUpdatedDate": new Date().toISOString(),
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "offSet": "setone",
        "objVersion": 123,
        "enableFlag": "1"
      };
      let res = masterTimeZone.save(testmasterTimeZoneCollection);
      expect(res)
        .to.eventually.include(testmasterTimeZoneCollection)
        .notify(done);
    });

    it("should fail saving invalid object to database", (done) => {
      // not even a  object

      let invalidObject = {
        // add a invalid masterTimeZone object
        "createdBy": "SYSTEM",
        "updatedBy": "SYSTEM",
        "offSet": "setone",
        "objVersion": 123,
        "enableFlag": "1"
      };
      let res = masterTimeZone.save(invalidObject);
      expect(res)
        .to.be.eventually.rejectedWith("masterTimeZoneCollection validation failed")
        .notify(done);
    });
  });

  describe("testing masterTimeZone.findAll by limit", () => {
    // 1. Delete all records in the table and insert
    //    4 new records.
    // find -should return an array of size equal to value of limit with the
    // roleMenuItemMaps.
    // Caveat - the order of the roleMenuItemMaps fetched is indeterminate

    // delete all records and insert four roleMenuItemMaps

    let object3 = {
      // add a valid masterTimeZone object
      "tenantId": "Obj3",
      "zoneCode": "IST",
      "zoneName": "ASIA",
      "offsetValue": "offthree",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "offSet": "setthree",
      "objVersion": 123,
      "enableFlag": "1"
    };
    let object4 = {
      // add a valid masterTimeZone object
      "tenantId": "Objfour",
      "zoneCode": "IST",
      "zoneName": "ASIA",
      "offsetValue": "offfour",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "offSet": "setfour",
      "objVersion": 123,
      "enableFlag": "1"
    };

    beforeEach((done) => {
      masterTimeZone.deleteAll().then(() => {
        masterTimeZone.save(object1).then((res) => {
          masterTimeZone.save(object2).then((res) => {
            masterTimeZone.save(object3).then((res) => {
              masterTimeZone.save(object4).then((res) => {
                done();
              });
            });
          });
        });
      });
    });

    it("should return limited number of records", (done) => {
      let res = masterTimeZone.findAll(3);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(3);
          expect(docs[0])
            .to.include(object1);
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });

    it("should return all records if value of limit parameter is less than 1 i.e, 0 or -1", (done) => {
      let res = masterTimeZone.findAll(-1);
      expect(res)
        .to.be.fulfilled.then((docs) => {
          expect(docs)
            .to.be.a('array');
          expect(docs.length)
            .to.equal(4);
          expect(docs[0])
            .to.include(object1);
          done();
        }, (err) => {
          done(err);
        })
        .catch((e) => {
          done(e);
        });
    });
  });

  // describe("testing roleMenuItemMap.find without data", () => {
  //   // delete all records
  //   // find should return empty array
  //   beforeEach((done) => {
  //     masterTimeZone.deleteAll()
  //       .then((res) => {
  //         done();
  //       });
  //   });
  //
  //   it("should return empty array i.e. []", (done) => {
  //     let res = masterTimeZone.findAll(2);
  //     expect(res)
  //       .to.be.fulfilled.then((docs) => {
  //         expect(docs)
  //           .to.be.a('array');
  //         expect(docs.length)
  //           .to.equal(0);
  //         expect(docs)
  //           .to.eql([]);
  //         done();
  //       }, (err) => {
  //         done(err);
  //       })
  //       .catch((e) => {
  //         done(e);
  //       });
  //   });
  // });

  // describe("testing masterTimeZone.findById", () => {
  //   // Delete all records, insert one record , get its id
  //   // 1. Query by this id and it should return one masterTimeZone
  //   // 2. Query by an arbitrary id and it should return {}
  //   // 3. Query with null id and it should throw IllegalArgumentException
  //   // 4. Query with undefined and it should throw IllegalArgumentException
  //   // 5. Query with arbitrary object
  //   let testObject = {
  //     //add a valid masterTimeZone object
  //
  //   };
  //   var id;
  //   beforeEach((done) => {
  //     masterTimeZone.deleteAll()
  //       .then((res) => {
  //         masterTimeZone.save(testObject)
  //           .then((savedObj) => {
  //             id = savedObj._id;
  //             done();
  //           });
  //       });
  //   });
  //
  //   it("should return masterTimeZone identified by Id ", (done) => {
  //     let res = masterTimeZone.findById(id);
  //     expect(res)
  //       .to.eventually.include(testObject)
  //       .notify(done);
  //   });
  //
  //   it("should return null as no masterTimeZone is identified by this Id ", (done) => {
  //     let badId = new mongoose.mongo.ObjectId();
  //     let res = masterTimeZone.findById(badId);
  //     expect(res)
  //       .to.eventually.to.eql(null)
  //       .notify(done);
  //   });
  // });
  //
  // describe("testing masterTimeZone.findOne", () => {
  //   // Delete all records, insert two record
  //   // 1. Query by one attribute and it should return one masterTimeZone
  //   // 2. Query by an arbitrary attribute value and it should return {}
  //
  //   // delete all records and insert two masterTimeZones
  //   beforeEach((done) => {
  //     masterTimeZone.deleteAll()
  //       .then((res) => {
  //         masterTimeZone.save(object1)
  //           .then((res) => {
  //             masterTimeZone.save(object2)
  //               .then((savedObj) => {
  //                 done();
  //               });
  //           });
  //       });
  //   });
  //
  //   it("should return object for valid attribute value", (done) => {
  //     // take one valid attribute and its value
  //     let attributename = "";
  //     let attributeValue = "";
  //     let res = masterTimeZone.findOne(attributename, attributeValue);
  //     expect(res)
  //       .to.eventually.include(object1)
  //       .notify(done);
  //   });
  //
  //   it("should return null as no masterTimeZone is identified by this attribute ", (done) => {
  //     let res = masterTimeZone.findOne(validAttribute, invalidValue);
  //     expect(res)
  //       .to.eventually.to.eql(null)
  //       .notify(done);
  //   });
  // });
  //
  // describe("testing masterTimeZone.findMany", () => {
  //   // Delete all records, insert two record
  //   // 1. Query by one attribute and it should return all masterTimeZones having attribute value
  //   // 2. Query by an arbitrary attribute value and it should return {}
  //   let masterTimeZone1 = {
  //     //add valid object
  //
  //   };
  //   let masterTimeZone2 = {
  //     //add valid object with one attribute value same as "masterTimeZone1"
  //
  //   };
  //   // delete all records and insert two masterTimeZones
  //   beforeEach((done) => {
  //     masterTimeZone.deleteAll()
  //       .then((res) => {
  //         masterTimeZone.save(masterTimeZone1)
  //           .then((res) => {
  //             masterTimeZone.save(masterTimeZone2)
  //               .then((savedObj) => {
  //                 done();
  //               });
  //           });
  //       });
  //   });
  //
  //   it("should return array of objects for valid attribute value", (done) => {
  //     // take one valid attribute and its value
  //     let attributename = "";
  //     let attributeValue = "";
  //     let res = masterTimeZone.findMany(attributename, attributeValue);
  //     expect(res).to.eventually.be.a("array");
  //     //enter proper length according to input attribute
  //     expect(res).to.eventually.have.length(1);
  //     done();
  //   });
  //
  //   it("should return empty array as no masterTimeZone is identified by this attribute ", (done) => {
  //     let res = masterTimeZone.findMany(validAttribute, invalidValue);
  //     expect(res)
  //       .to.eventually.to.eql([])
  //       .notify(done);
  //   });
  // });
});