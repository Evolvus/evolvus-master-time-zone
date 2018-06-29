const debug = require("debug")("evolvus-master-time-zone.test.index");
const chai = require("chai");
const mongoose = require("mongoose");

var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://10.10.69.204/TestPlatform_Dev";
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const masterTimeZone = require("../index");
const db = require("../db/masterTimeZone");

describe('masterTimeZone model validation', () => {
  let masterTimeZoneObject = {
    // add a valid masterTimeZone Object here
    "tenantId": "indester",
    "zoneCode": "IST",
    "zoneName": "ASIA",
    "offsetValue": "indestwo",
    "createdDate": new Date().toISOString(),
    "lastUpdatedDate": new Date().toISOString(),
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "offSet": "setindes",
    "objVersion": 123,
    "enableFlag": "1"
  };

  let invalidObject = {
    //add invalid masterTimeZone Object here
    "createdBy": "SYSTEM",
    "updatedBy": "SYSTEM",
    "offSet": "setone",
    "objVersion": 123,
    "enableFlag": "1"
  };

  let undefinedObject; // object that is not defined
  let nullObject = null; // object that is null

  // before we start the tests, connect to the database
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });

  describe("validation against jsonschema", () => {
    it("valid masterTimeZone should validate successfully", (done) => {
      try {
        var res = masterTimeZone.validate(masterTimeZoneObject);
        expect(res)
          .to.eventually.equal(true)
          .notify(done);
        // if notify is not done the test will fail
        // with timeout
      } catch (e) {
        expect.fail(e, null, `valid masterTimeZone object should not throw exception: ${e}`);
      }
    });

    it("invalid masterTimeZone should return errors", (done) => {
      try {
        var res = masterTimeZone.validate(invalidObject);
        expect(res)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    if ("should error out for undefined objects", (done) => {
        try {
          var res = masterTimeZone.validate(undefinedObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

    if ("should error out for null objects", (done) => {
        try {
          var res = masterTimeZone.validate(nullObject);
          expect(res)
            .to.be.rejected
            .notify(done);
        } catch (e) {
          expect.fail(e, null, `exception: ${e}`);
        }
      });

  });

  describe("testing masterTimeZone.save method", () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should save a valid masterTimeZone object to database', (done) => {
      try {
        var result = masterTimeZone.save(masterTimeZoneObject);
        //replace anyAttribute with one of the valid attribute of a masterTimeZone Object
        expect(result)
          .to.eventually.have.property("zoneCode")
          .to.eql(masterTimeZoneObject.zoneCode)
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `saving masterTimeZone object should not throw exception: ${e}`);
      }
    });

    it('should not save a invalid masterTimeZone object to database', (done) => {
      try {
        var result = masterTimeZone.save(invalidObject);
        expect(result)
          .to.be.rejected
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing masterTimeZone.getAll when there is data in database', () => {
    let object1 = {
      // add a valid masterTimeZone object
      "tenantId": "get",
      "zoneCode": "IST",
      "zoneName": "ASIA",
      "offsetValue": "getthree",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "offSet": "sgetthree",
      "objVersion": 123,
      "enableFlag": "1"
    };
    let object2 = {
      // add a valid masterTimeZone object
      "tenantId": "Ogetfour",
      "zoneCode": "IST",
      "zoneName": "ASIA",
      "offsetValue": "offfour",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "offSet": "setfgetour",
      "objVersion": 123,
      "enableFlag": "1"
    };

    let object3 = {
      // add a valid masterTimeZone object
      "tenantId": "get1",
      "zoneCode": "IST",
      "zoneName": "ASIA",
      "offsetValue": "offthree",
      "createdDate": new Date().toISOString(),
      "lastUpdatedDate": new Date().toISOString(),
      "createdBy": "SYSTEM",
      "updatedBy": "SYSTEM",
      "offSet": "get1hree",
      "objVersion": 123,
      "enableFlag": "1"
    };

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        db.save(object1).then((res) => {
          db.save(object2).then((res) => {
            db.save(object3).then((res) => {
              done();
            });
          });
        });
      });
    });

    it('should return limited records as specified by the limit parameter', (done) => {
      try {
        let res = masterTimeZone.getAll(2);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(2);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return all records if limit is -1', (done) => {
      try {
        let res = masterTimeZone.getAll(-1);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(3);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw IllegalArgumentException for null value of limit', (done) => {
      try {
        let res = masterTimeZone.getAll(null);
        expect(res)
          .to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should throw IllegalArgumentException for undefined value of limit', (done) => {
      try {
        let undefinedLimit;
        let res = masterTimeZone.getAll(undefinedLimit);
        expect(res)
          .to.be.rejectedWith("IllegalArgumentException")
          .notify(done);
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

  });

  describe('testing masterTimeZone.getAll when there is no data', () => {

    beforeEach((done) => {
      db.deleteAll().then((res) => {
        done();
      });
    });

    it('should return empty array when limit is -1', (done) => {
      try {
        let res = masterTimeZone.getAll(-1);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(0);
            expect(docs)
              .to.eql([]);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });

    it('should return empty array when limit is positive value ', (done) => {
      try {
        let res = masterTimeZone.getAll(2);
        expect(res)
          .to.be.fulfilled.then((docs) => {
            expect(docs)
              .to.be.a('array');
            expect(docs.length)
              .to.equal(0);
            expect(docs)
              .to.eql([]);
            done();
          });
      } catch (e) {
        expect.fail(e, null, `exception: ${e}`);
      }
    });
  });

  // describe('testing getById', () => {
  //   // Insert one record , get its id
  //   // 1. Query by this id and it should return one masterTimeZone object
  //   // 2. Query by an arbitrary id and it should return {}
  //   // 3. Query with null id and it should throw IllegalArgumentException
  //   // 4. Query with undefined and it should throw IllegalArgumentException
  //   var id;
  //   beforeEach((done) => {
  //     db.save(masterTimeZoneObject).then((res) => {
  //       id = res._id;
  //       done();
  //     });
  //   });
  //
  //   it('should return one masterTimeZone matching parameter id', (done) => {
  //     try {
  //       var res = masterTimeZone.getById(id);
  //       expect(res).to.eventually.have.property('_id')
  //         .to.eql(id)
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it('should return empty object i.e. {} as no masterTimeZone is identified by this Id ', (done) => {
  //     try {
  //       let badId = new mongoose.mongo.ObjectId();
  //       var res = masterTimeZone.getById(badId);
  //       expect(res).to.eventually.to.eql({})
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for undefined Id parameter ", (done) => {
  //     try {
  //       let undefinedId;
  //       let res = masterTimeZone.getById(undefinedId);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for null Id parameter ", (done) => {
  //     try {
  //       let res = masterTimeZone.getById(null);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should be rejected for arbitrary object as Id parameter ", (done) => {
  //     // an id is a 12 byte string, -1 is an invalid id value
  //     let id = masterTimeZoneObject;
  //     let res = masterTimeZone.getById(id);
  //     expect(res)
  //       .to.eventually.to.be.rejectedWith("must be a single String of 12 bytes")
  //       .notify(done);
  //   });
  //
  // });
  //
  // describe("testing masterTimeZone.getOne", () => {
  //   let object1 = {
  //       //add one valid masterTimeZone object here
  //
  //     },
  //     object2 = {
  //       //add one more valid masterTimeZone object here
  //
  //     };
  //   beforeEach((done) => {
  //     db.deleteAll().then((res) => {
  //       db.save(object1).then((res) => {
  //         db.save(object2).then((res) => {
  //           done();
  //         });
  //       });
  //     });
  //   });
  //
  //   it("should return one masterTimeZone record identified by attribute", (done) => {
  //     try {
  //       // take one attribute from object1 or object2 and its value
  //       let res = masterTimeZone.getOne(attribute of object1 / object2, its value);
  //       expect(res)
  //         .to.eventually.be.a("object")
  //         .to.have.property('attribute of object1/object2')
  //         .to.eql('attribute value')
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it('should return empty object i.e. {} as no masterTimeZone is identified by this attribute', (done) => {
  //     try {
  //       // replace validAttribute and add a bad value to it
  //       var res = masterTimeZone.getOne(validAttribute, badValue);
  //       expect(res).to.eventually.to.eql({})
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //     try {
  //       //replace validvalue with a valid value for an attribute
  //       let undefinedAttribute;
  //       let res = masterTimeZone.getOne(undefinedAttribute, validValue);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //     try {
  //       // replace validAttribute with a valid attribute name
  //       let undefinedValue;
  //       let res = masterTimeZone.getOne(validAttribute, undefinedValue);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
  //     try {
  //       //replace validValue with a valid value for an attribute
  //       let res = masterTimeZone.getOne(null, validValue);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for null value parameter ", (done) => {
  //     try {
  //       //replace attributeValue with a valid attribute name
  //       let res = masterTimeZone.getOne(attributeValue, null);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  // });
  //
  //
  // describe("testing masterTimeZone.getMany", () => {
  //   let object1 = {
  //       //add one valid masterTimeZone object here
  //
  //     },
  //     object2 = {
  //       //add one more valid masterTimeZone object here
  //
  //     };
  //   beforeEach((done) => {
  //     db.deleteAll().then((res) => {
  //       db.save(object1).then((res) => {
  //         db.save(object2).then((res) => {
  //           done();
  //         });
  //       });
  //     });
  //   });
  //
  //   it("should return array of masterTimeZone records identified by attribute", (done) => {
  //     try {
  //       // take one attribute from object1 or object2 and its value
  //       let res = masterTimeZone.getMany(attribute of object1 / object2, its value);
  //       expect(res).to.eventually.be.a("array");
  //       //enter proper length according to input value
  //       expect(res).to.eventually.have.length(1);
  //       done();
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it('should return empty array i.e. [] as no masterTimeZone is identified by this attribute', (done) => {
  //     try {
  //       // replace validAttribute and add a bad value to it
  //       var res = masterTimeZone.getMany(validAttribute, badValue);
  //       expect(res).to.eventually.to.eql([])
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //     try {
  //       //replace validvalue with a valid value for an attribute
  //       let undefinedAttribute;
  //       let res = masterTimeZone.getMany(undefinedAttribute, validValue);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for undefined Attribute parameter ", (done) => {
  //     try {
  //       // replace validAttribute with a valid attribute name
  //       let undefinedValue;
  //       let res = masterTimeZone.getMany(validAttribute, undefinedValue);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for null attribute parameter ", (done) => {
  //     try {
  //       //replace validValue with a valid value for an attribute
  //       let res = masterTimeZone.getMany(null, validValue);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  //
  //   it("should throw IllegalArgumentException for null value parameter ", (done) => {
  //     try {
  //       //replace attributeValue with a valid attribute name
  //       let res = masterTimeZone.getMany(attributeValue, null);
  //       expect(res)
  //         .to.eventually.to.be.rejectedWith("IllegalArgumentException")
  //         .notify(done);
  //     } catch (e) {
  //       expect.fail(e, null, `exception: ${e}`);
  //     }
  //   });
  // });
});