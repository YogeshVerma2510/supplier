import { LightningElement,track,api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getSite from '@salesforce/apex/supSite.getSite';
import SupSite_Obj from '@salesforce/schema/Supplier_Site_Facility__c';
import sFCode from '@salesforce/schema/Supplier_Site_Facility__c.Name';
import sFName from '@salesforce/schema/Supplier_Site_Facility__c.Facility_Name__c';
import sSAdd from '@salesforce/schema/Supplier_Site_Facility__c.Supplier_Address__c';
import sSStateProv from '@salesforce/schema/Supplier_Site_Facility__c.State_Province__c'
import siteSupID from '@salesforce/schema/Supplier_Site_Facility__c.Supplier__c';
import sSCity from '@salesforce/schema/Supplier_Site_Facility__c.City__c';
import sSCountry from '@salesforce/schema/Supplier_Site_Facility__c.Country__c';

const columns=[
 { label: 'Facility Name', fieldName: 'Facility_Name__c', type: 'text', hideDefaultActions: 'true' },
 { label: 'facility Code', fieldName: 'Name', type: 'text', hideDefaultActions: 'true' },
 { label: 'Supplier Address', fieldName: 'Supplier_Address__c', type: 'text', hideDefaultActions: 'true' },
 { label: 'State/Province', fieldName: 'State_Province__c', type: 'text', hideDefaultActions: 'true' },
 { label: 'City', fieldName: 'City__c', type: 'text', hideDefaultActions: 'true' },
 { label: 'Country', fieldName: 'Country__c', type: 'text', hideDefaultActions: 'true' },

]

export default class supplierSiteFacility extends LightningElement {

@api recordId;

@track siteList;
supId='';
columns=columns;
 siteFacilityName;
 siteFacilityCode;
 siteFacSuppAddress;
 siteFacStateProv;
 siteFacCity;
 siteFacCountry;


handleName(event){
this.siteFacilityName=event.target.value;
}
handleCode(event){
 this.siteFacilityCode=event.target.value;
}
handleAddress(event){
this.siteFacSuppAddress=event.target.value;
}
handleState(event){
this.siteFacStateProv=event.target.value;
}
handleCity(event){
this.siteFacCity=event.target.value;
}
handleCountry(event){
this.siteFacCountry=event.target.value;
}

/** here getting data for datatable */

siteDataTable(conId){
 getSite({sId:conId})
 .then(result=>{
 var tempBomList=[];
 for(var i=0;i<result.length;i++){
 let tempRecord= Object.assign({},result[i]);
 console.log(tempRecord.fileName);
 tempBomList.push(tempRecord);
 }
 this.siteList=tempBomList;
 console.log(this.siteList);
 this.error=undefined;
 })
 .catch(error=>{
 console.log(JSON.stringify(error));
 });
}

/**here saving site facility */

save(){
 if(this.checkError()){
 this.createSiteFacility();
 this.openmodel = false;
 }
}

createSiteFacility(){
 const fields ={};
 fields[sFName.fieldApiName]=this.siteFacilityName;
 fields[sSAdd.fieldApiName]=this.siteFacSuppAddress;
 fields[sSStateProv.fieldApiName]=this.siteFacStateProv;
 fields[sSCity.fieldApiName]=this.siteFacCity;
 fields[sFCode.fieldApiName]=this.siteFacilityCode;
 fields[sSCountry.fieldApiName]=this.siteFacCountry;
 fields[siteSupID.fieldApiName]=this.recordId;

 const recordInput ={apiName:SupSite_Obj.objectApiName,fields}
 createRecord(recordInput)
 .then(result=>{
 this.supId=this.recordId;
 this.openmodel = false;
 this.dispatchEvent(new ShowToastEvent({
 title: 'Success!!',
 message: 'Facility Created Successfully!!',
 variant: 'success'
 })
 );
 window.location.reload();
 setInterval(window.location.reload(),3000);
 //this.handleReset();
 //setTimeout(() => {
 //this.siteDataTable(this.supId);
// }, 500);



 }).catch(error=>{
 console.log(JSON.stringify(error));
 this.dispatchEvent(
 new ShowToastEvent({
 title: 'Error creating record',
 message: error.body.message,
 variant: 'error',
 }),
 );
 });
}


checkError() {
 var valid = true;
 var inputs = this.template.querySelectorAll(".requiredfield");
 inputs.forEach((input) => {

 if (!input.checkValidity()) {
 input.reportValidity();
 valid = false;

 }
 });
 return valid;
}

handleReset(event) {
 const inputfields = this.template.querySelectorAll('.resetfield');
 if (inputfields) {
 inputfields.forEach(field => {
 field.value = '';
 });
 this.siteFacCity=null;
 this.siteFacCountry=null;
 this.siteFacStateProv=null;
 this.siteFacSuppAddress=null;
 this.siteFacilityName=null;
 this.siteFacilityCode=null;
 }    
}
@track openmodel = false;
openmodal() {
this.openmodel = true;
}
closemodal() {
this.openmodel = false;
}
}