import { LightningElement, wire, track, api } from "lwc";
import { createRecord, getRecord, getFieldValue, updateRecord } from "lightning/uiRecordApi";
import { getObjectInfo } from "lightning/uiObjectInfoApi";
import SUPPLIER_OBJECT from "@salesforce/schema/Supplier__c";
import boms from "@salesforce/resourceUrl/Bomicon";
import getnumber from "@salesforce/schema/Supplier__c.Name";
import getname from "@salesforce/schema/Supplier__c.Supplier_Name__c";
import getGSTIN from "@salesforce/schema/Supplier__c.GSTIN_Number__c";
import CLASS from "@salesforce/schema/Supplier__c.Class__c";
import AML_ACTIVE from '@salesforce/schema/Supplier__c.AML_Active__c';
import AML_INACTIVE from '@salesforce/schema/Supplier__c.AML_In_Active__c';
const SUPPLIER_FIELDS = [getnumber, getname, getGSTIN,CLASS,AML_ACTIVE,AML_INACTIVE];

export default class Supplier_hpanel extends LightningElement {

     // icon
  Bicon = boms;
  @api recordId;
  number;
  name;
  gstin;
  class1;
  amlactive;
  amlinactive;

  @wire(getObjectInfo, {
    objectApiName: SUPPLIER_OBJECT
  })
  SUPPLIERAPI;

  @wire(getRecord, {
    recordId: "$recordId",
    fields: SUPPLIER_FIELDS
  })
  wiredRecord(result) {
    let data = result.data;
    if (data) {
      this.number = getFieldValue(data, getnumber);
      this.name = getFieldValue(data, getname);
      this.gstin = getFieldValue(data, getGSTIN);
      this.class1=getFieldValue(data,CLASS);
      // this.amlactive=getFieldValue(data,AML_ACTIVE);
      // this.amlinactive=getFieldValue(data,AML_INACTIVE);
     
      // this.tempcreatedby = this.createdby;
    }
  }
  
}