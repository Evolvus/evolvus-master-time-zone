/*
 ** JSON Schema representation of the masterTimeZone model
 */
module.exports.schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "masterTimeZoneModel",
  "type": "object",
  "properties": {
    "tenantId": {
      "type": "string",
      "minLength": 1,
      "maxLength": 64
    },
    "zoneCode": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "zoneName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "offsetValue": {
      "type": "string"
    },
    "createdDate": {
      "type": "string",
      "format": "date-time"
    },
    "lastUpdatedDate": {
      "type": "string",
      "format": "date-time"
    },
    "createdBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "updatedBy": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "offSet": {
      "type": "string"
    },
    "objVersion": {
      "type": "number"
    },
    "enableFlag": {
      "type": "string",
      "default": "1",
      "enum": ["0", "1"]
    }

  },
  "required": ["tenantId", "zoneCode", "zoneName"]
};