import { LightningElement, track, api, wire } from 'lwc';
import getPartdata from '@salesforce/apex/supplierpartdatatable.getPartdata';
import sBId from '@salesforce/schema/Supplier_Part__c.BOM__c';
import getBomName from '@salesforce/apex/sitePart.getBomName';
import getBomLookup from '@salesforce/apex/sitePart.getBom';
// import getResults from '@salesforce/apex/supplierpartdatatable.getResults';
// import insertAffectedItems from '@salesforce/apex/supplierpartdatatable.insertAffectedItems';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ID_FIELD from '@salesforce/schema/Supplier_Part__c.Id';
import Part_Type from '@salesforce/schema/Supplier_Part__c.Part_Type__c';
import sPId from '@salesforce/schema/Supplier_Part__c.Part__c';
import sPLead from '@salesforce/schema/Supplier_Part__c.Lead_Time__c';
// import bOm from '@salesforce/schema/Supplier_Part__c.K1_PLM__Bom__c';
import { refreshApex } from '@salesforce/apex';
import { createRecord, updateRecord } from 'lightning/uiRecordApi';
import nothumbnail from '@salesforce/resourceUrl/thumbnail';
import getPartName from '@salesforce/apex/sitePart.getPartName';
import sBName from '@salesforce/schema/Supplier_Part__c.Bom_Name__c';

// import getBomName from '@salesforce/apex/sitePart.getBomName';
import getPart from '@salesforce/apex/sitePart.getPartList';
import getPartLookup from '@salesforce/apex/sitePart.getPart';
import SupPart_Obj from '@salesforce/schema/Supplier_Part__c';
//import SupBom_Obj from '@salsforce/schema/'
import sPName from '@salesforce/schema/Supplier_Part__c.Part_Name__c';
import supP from '@salesforce/schema/Supplier_Part__c.Supplier__c';
import revision from '@salesforce/schema/Supplier_Part__c.Revision__c';
import searchPart from "@salesforce/apex/supplierpartdatatable.searchPart";
import deletepart from '@salesforce/apex/supplierpartdatatable.deletePart';
//import UserProfile from '@salesforce/apex/supplierpartdatatable.currentUserInfo';

//Getting list of permission sets for current logged in user
//import permissionSetName from '@salesforce/apex/GetCurrentUserPermissionSet.permissionSetName';

const columns = [{
//   label: "Part/Bom Id",
//   fieldName: 'reclink',
//   hideDefaultActions: true,
//   type: 'url',
//   typeAttributes: {
//     label: {
//       fieldName: 'recNumber'
//     },
//     target: '_blank'
//   }
// }, {
//   label: 'Thumbnail',
//   fieldName: 'file',
//   type: 'thumb',
//   hideDefaultActions: true
// },
// {
  label: "Part/Bom Name",
  fieldName: 'reclink',
  hideDefaultActions: true,
  type: 'url',
  typeAttributes: {
    label: {
      fieldName: 'recName'
    },
    target: '_blank'
  }
},
{
  label: 'Revision',
   fieldName: 'revBom',
  hideDefaultActions: true,
  type: 'url',
  typeAttributes: {
    label: {
      fieldName: 'recRev'
    },
    target: '_blank'
  }
},

{
  label: 'Lead Time',
  fieldName: 'recTime',
  hideDefaultActions: true,
  editable: true
},
{
  label: 'Part Type',
  fieldName: 'recType',
  hideDefaultActions: true
},
{
  type: 'button-icon',
  typeAttributes: {
    iconName: 'utility:delete',
    name: 'delete',
  }
}
];

const columns1 = [{
//   label: "Part/Bom Id",
//   fieldName: 'reclink',
//   hideDefaultActions: true,
//   type: 'url',
//   typeAttributes: {
//     label: {
//       fieldName: 'recNumber'
//     },
//     target: '_blank'
//   }
// },
// {
//   label: 'Revision',
//   fieldName: 'revBom',
//  hideDefaultActions: true,
//  type: 'url',
//  typeAttributes: {
//    label: {
//      fieldName: 'recRev'
//    },
//    target: '_blank'
//  }
// },
// {
  label: "Part/Bom Name",
  fieldName: 'reclink',
  hideDefaultActions: true,
  type: 'url',
  typeAttributes: {
    label: {
      fieldName: 'recName'
    },
    target: '_blank'
  }
},

{
  label: 'Lead Time',
  fieldName: 'recTime',
  hideDefaultActions: true,
  editable: true
},
{
  label: 'Part Type',
  fieldName: 'recType',
  hideDefaultActions: true
},
];

export default class supplierpartdatatable extends LightningElement {
  fReId;
  refreshTable;
  error;
  accountId;
  tempPartName;
  redirect = true;
  resetpage = false;
  clickedButtonLabel;
  checkReload = false;
  showLoadingSpinner = false;
  showSearchedValues = false;
  sPartName;
  sBomName;
  sPartType;
  sPartLead;

  @api recordId;
  @track data;
  @track searchTermAssignee;
  @track tempPartNum;
  @track sPartId;
  @track recordsList = [];
  @track isAssigneeValueSelected = false;
  @track showDropDownAssignee = false;
  @track message = "";
  @track contacts;
  @track error;
  @track SrPart = false;
  @track SrBom = false;
  columns = columns;
  // @track draftValues = [];
  @track rowOffset = 0;
  @track isShowResult = true;
  @track findname = '';
  @track messageResult = false;
  @track showAllData = false;
  @track issList;
  @wire(getPartdata, {
    recordId: '$recordId'
  })
  contacts(result) {
    this.refreshTable = result;
    let getDocBaseUrl = `https://${window.location.hostname.split(".")[0]
      }--c.documentforce.com`;
    const {
      data,
      error
    } = result;
    if (data) {
      var tempPartList = [];
      for (var i = 0; i < data.length; i++) {
        let tempRecord = Object.assign({}, data[i]);
        tempRecord.reclink = "/" + tempRecord.recPart;
        if(tempRecord.revBom != null){
        tempRecord.revBom = "/" + tempRecord.revBom;
        }
        if (tempRecord.thumb === "") {
          tempRecord.file = nothumbnail;
        } 
        else {
          tempRecord.file = `${getDocBaseUrl}/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${tempRecord.thumb}`;
        }
        tempPartList.push(tempRecord);
      }
      this.data = tempPartList;
      console.log(" data " + this.data)
      this.error = undefined;
    } else
      if (error) {
        this.data = undefined;
        this.error = error;
      }
  }
  // SEARCH
  handleClick() {
    this.isShowResult = true;
    this.messageResult = false;
  }
  handleChange(event) {
    this.messageResult = false;
    this.findname = event.target.value;
  }
  @wire(searchPart, {
    isName: '$findname',
    recordId: "$recordId"
  })
  searchparts({
    data
  }) {
    let getDocBaseUrl = `https://${window.location.hostname.split(".")[0]
      }--c.documentforce.com`;
    if (data) {

      if (data.length > 0 && this.isShowResult) {
        var tempPartList = [];
        for (var i = 0; i < data.length; i++) {
          let tempRecord = Object.assign({}, data[i]);
          tempRecord.reclink = "/" + tempRecord.recId;
          if(tempRecord.revBom != null){
            tempRecord.revBom = "/" + tempRecord.revBom;
            }
          if (tempRecord.thumb === "") {
            tempRecord.file = nothumbnail;
          } else {
            tempRecord.file = `${getDocBaseUrl}/sfc/servlet.shepherd/version/renditionDownload?rendition=THUMB720BY480&versionId=${tempRecord.thumb}`;
          }
          tempPartList.push(tempRecord);
        }
        console.log(tempPartList);
        this.searchList = tempPartList;
        this.error = undefined;
        this.showSearchedValues = true;
        this.messageResult = false;
      } else if (data.length == 0) {
        this.searchList = [];

        if (this.findname != "") {
          this.showSearchedValues = true;
          this.messageResult = true;
        } else if (this.findname == "") {
          this.showSearchedValues = false;
        }
      }
      else if (error) {
        this.error = error;
        this.searchList = undefined;
      }
    }
  }
  // search end
  @track bShowModal = false;

  closeModal() {
    this.bShowModal = false;
  }
  @track modal = false;

  open() {
    this.modal = true;
  }
  close() {
    this.modal = false;
  }

  handleAssigneeClick() {
    this.showDropDownAssignee = true;
  }
  handleRemoveAssigneePill() {
    this.isAssigneeValueSelected = false;
    this.searchTermAssignee = '';
    this.selectedName = '';
    this.selectedId = "";
    this.SrPart = false;
    this.SrBom = false;
    this.showDropDownAssignee = false;

  }
  onAssigneeChange(event) {
    this.searchTermAssignee = event.target.value;

    if (this.searchTermAssignee.length > 0) {
      this.showDropDownAssignee = true;
      this.getLookupResult();
    } else {
      this.showDropDownAssignee = false
    }
  }

  onAssigneeSelect(event) {
    let selectedId = event.currentTarget.dataset.id;
    let selectedName = event.currentTarget.dataset.name;
    this.isAssigneeValueSelected = true;
    this.tempPartNum = selectedName;
    this.SrPart = false;
    this.SrBom = true;
    this.sPartId = selectedId;
    if (this.sPartId === null) {
      this.tempPartName = null;
    } else {
      getPartName({
        PartId: this.sPartId
      })
        .then(result => {
          this.sPartName = result;
          console.log('part Name', this.sPartName);
        })
    }
    

 

    this.showDropDownAssignee = false;
  }
  

  handleSelected(event) {
    this.sPartType = event.detail;
    console.log('h', this.sPartType);
  }

  handleLead(event) {
    this.sPartLead = event.target.value;
  }

  handleReset(event) {
    const inputfields = this.template.querySelectorAll('.resetfield');
    if (inputfields) {
      inputfields.forEach(field => {
        field.value = '';
        this.template.querySelector("c-part-type-picklist").resetLookup();
      });
    
      this.sPartIdb = null;
      this.sPartId = null;
      this.tempPartNum = null;
      this.handleRemoveAssigneePill();
      this.handleRemoveAssigneebPill();
      this.sPartName = null;
      this.sPartName  = null;
      this.sPartLead = null;
      this.tempPartName = null;

    }
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

  createPart() {
    const fields = {}
    if(this.sPartIdb != null){
    fields[sBId.fieldApiName] = this.sPartIdb;
    fields[sBName.fieldApiName] = this.sBomName;
    fields[sPLead.fieldApiName] = this.sPartLead;
    fields[supP.fieldApiName] = this.recordId;
    fields[Part_Type.fieldApiName] = this.sPartType;
    fields[revision.fieldApiName] = this.PROrecID;
    }if(this.sPartId != null){
      fields[sPName.fieldApiName] = this.sPartName;
      fields[sPId.fieldApiName] = this.sPartId;
      fields[sPLead.fieldApiName] = this.sPartLead;
      fields[supP.fieldApiName] = this.recordId;
      fields[Part_Type.fieldApiName] = this.sPartType;
    }
    console.log(this.sPartIdb);
    console.log(this.sPartId);
    const recordInput = {
      apiName: SupPart_Obj.objectApiName,
      fields
    };
    console.log('fields are here: ' + recordInput);

    createRecord(recordInput)
      .then(result => {
        this.modal = false;
        this.dispatchEvent(new ShowToastEvent({
          title: 'Success!!',
          message: 'Part Created Successfully!!',
          variant: 'success'
        }));
        // this.sPartId = fin.id;
        // this.handleSaveFiles(this.recordId);
        // if (this.selectedId.length > 0) {
        //   console.log('insisde afftectd items');
        //   insertAffectedItems({ multipleId: this.selectedId, fId: this.sPartId })
      // }
        this.handleReset();
        return refreshApex(this.refreshTable);
      })
      .catch(error => {
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

  save() {
    if (this.checkError()) {
      this.createPart();

    }
  }

  getLookupResult() {
    this.recordsList = [];
    this.message = ''
    getPartLookup({
      Search: this.searchTermAssignee
    })
      .then((result) => {
        if (result.length === 0) {
          this.recordsList = [];
          this.message = "No Records Found";
        } else {
          this.recordsList = result;
          this.message = "";
        }
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        this.recordsList = undefined;
      });
  }

  // DELETE
  selectedRow;
  openModal(event) {
    this.bShowModal = true;
    let actionName = event.detail.action.name;
    console.log('actionName ====> ' + actionName);
    let r = event.detail.row;
    this.selectedRow = r;
    console.log(' this.selectedRow ====> ' + this.selectedRow);
  }
  handleFileDelete() {
    let currentRowId = [];
    console.log(' this.selectedRow.recId ====> ' + this.selectedRow.recId);
    currentRowId.push(this.selectedRow.recId);
    console.log(' currentRowId ====> ' + currentRowId);
    deletepart({
      ids: currentRowId
    })
      .then(result => {
        this.dispatchEvent(new ShowToastEvent({
          title: 'Success!!',
          message: 'Part Deleted Successfully!!',
          variant: 'success'
        }));
        this.bShowModal = false;
        refreshApex(this.refreshTable);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error deleting record',
            message: error.body.message,
            variant: 'error',
          }),
        );
      });
    console.log('inside delete');
  }

  // showAdd = false;
  // colwithdel = false;
  // colwithoutdel = false;
  //table = false;
  // @wire(permissionSetName)
  // currentUserProfile({
  //   data
  // }) {
    // if (data) {
    //   this.currentUser = data;
    //   console.log(this.currentUser);
    //   if (this.currentUser == "Custom: Supply Manager") {
    //     this.showAdd = true;
    //     this.colwithdel = true;
    //     this.columns = columns;
    //     console.log(" this.columns " + this.columns);
    //   } else if (this.currentUser == "System Administrator") {
    //     this.showAdd = true;
    //     this.colwithdel = true;
    //     this.columns = columns;

    //     console.log(" this.columns1 " + this.columns);
    //   } else {
    //     this.showAdd = false;
    //     this.colwithoutdel = true;
    //     this.columns = columns1;
    //     console.log(" this.columns1 else " + this.columns);
    //   }
    // }

  //   if(data) {
  //     data.forEach((permissionname)=>{
  //       //Permission name have to be mentioned Eg:'Custom_Supply_Manager'  
  //       if(permissionname == 'Custom_Supply_Manager' || permissionname == 'Custom_KloudPLM_Administrator') {
  //         this.showAdd = true;
  //         this.colwithdel = true;
  //         this.columns = columns;
  //         this.table = true;
  //       }
  //       else{
  //         this.showAdd = false;
  //         this.colwithoutdel = true;
  //         this.columns = columns1;
  //         this.table = false;
  //       }
  //       // if(this.showAdd == false){
  //       //   this.colwithoutdel = true;
  //       //   this.columns = columns1;
  //       // }
  //     })  
  //   }
  // }

  // updating value by inline editing
  draftValues = [];
  handleSave(event) {
    console.log('in save handle');
    const fields = {};
    fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].recId;
    fields[sPLead.fieldApiName] = event.detail.draftValues[0].recTime;
    console.log(fields + ' field data ');
    const recordInput = { fields };
    updateRecord(recordInput)
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Supplier Part updated successfully',
            variant: 'success'
          })
        );
        // Display fresh data in the datatable
        return refreshApex(this.refreshTable).then(() => {
          // Clear all draft values in the datatable
          this.draftValues = [];
        });
      }).catch(error => {
        console.log(JSON.stringify(error));
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Error while updating',
            message: error.body.message,
            variant: 'error'
          })
        );
      });
  }
  @api fieldName = 'Name';
  @api iconName = 'standard:account';
  @track searchRecords = [];
  @track selectedRecords = [];
  @api required = false;

  @api LoadingText = false;
  @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
  @track messageFlag = false;
  selectedId = [];

  multiId;

  /**
    * Searching user from salseforce database
    * @param {*} event 
    */
  searchField(event) {


      var currentText = event.target.value;
      var selectRecId = [];
      for (let i = 0; i < this.selectedRecords.length; i++) {
          selectRecId.push(this.selectedRecords[i].recId);
      }
      this.LoadingText = true;
      getResults({ value: currentText, selectedRecId: selectRecId })
          .then(result => {
              this.searchRecords = result;
              this.LoadingText = false;

              this.txtclassname = result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
              if (currentText.length > 0 && result.length == 0) {
                  this.messageFlag = true;
              }
              else {
                  this.messageFlag = false;
              }

              if (this.selectRecordId != null && this.selectRecordId.length > 0) {
                  this.iconFlag = false;
                  this.clearIconFlag = true;
              }
              else {
                  this.iconFlag = true;
                  this.clearIconFlag = false;
              }
          })
          .catch(error => {
              console.log('-------error-------------' + error);
              console.log(error);
          });

  }

/**
* Adding record to the pill
* @param {*} event 
*/  setSelectedRecord(event) {
      var recId = event.currentTarget.dataset.id;
      var selectName = event.currentTarget.dataset.name;
      var Id = recId;
      let newsObject = { 'recId': recId, 'recName': selectName };
      this.selectedRecords.push(newsObject);
      this.selectedId.push(Id);
      this.txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';

      let selRecords = this.selectedRecords;
      //this.template.querySelector('[data-id="user-input"]').forEach(each => {
      //  each.value = '';
      // });
      const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
  }

  /**
   * Removing record from pill
   * @param {*} event 
   */
  removeRecord(event) {
      let selectRecId = [];
      for (let i = 0; i < this.selectedRecords.length; i++) {
          if (event.detail.name !== this.selectedRecords[i].recId)
              selectRecId.push(this.selectedRecords[i]);
      }
      this.selectedRecords = [...selectRecId];

      let removeId = [];
      for (let i = 0; i < this.selectedId.length; i++) {
          if (event.detail.name !== this.selectedId[i])
              removeId.push(this.selectedId[i]);
      }
      this.selectedId = removeId;


      let selRecords = this.selectedRecords;
      const selectedEvent = new CustomEvent('selected', { detail: { selRecords }, });
      // Dispatches the event.
      this.dispatchEvent(selectedEvent);
      console.log(this.selectedId);
 
 
    }
// bom lookup
@api recordIdd;

  @track data;
  @track searchTermAssigneeb;
  @track tempPartNumb;
  @track sPartIdb;
  @track recordsListb = [];
  @track isAssigneeValueSelectedb = false;
  @track showDropDownAssigneeb = false;
  @track message = "";
  // @track contactsb;
  @track error;
 tempPartNameb;
sBomName;

handleAssigneeClickb() {
    this.showDropDownAssigneeb = true;
  }
  handleRemoveAssigneebPill() {
    this.isAssigneeValueSelectedb = false;
    this.searchTermAssigneeb = '';
    this.selectedNameb = '';
    this.selectedbId = "";
    this.SrBom = false;
    this.SrPart = false;
    this.showDropDownAssigneeb = false;

  }
  PROName;
    PROrecID;
    onProcessSelection(event) {
        this.PROName = event.detail.selectedValue;
        this.PROrecID = event.detail.selectedRecordId;
        console.log('this.PROrecID' + this.PROrecID);
      }
  onAssigneeChangeb(event) {
    this.searchTermAssigneeb= event.target.value;

    if (this.searchTermAssigneeb.length > 0) {
      this.showDropDownAssigneeb = true;
      this.getLookupResultb();
    } else {
      this.showDropDownAssigneeb= false
    }
  }

  onAssigneeSelectb(event) {
    let selectedbId = event.currentTarget.dataset.id;
    let selectedNameb = event.currentTarget.dataset.name;
    this.isAssigneeValueSelectedb = true;
    this.tempPartNumb = selectedNameb;
    this.SrBom = false;
    this.SrPart = true;
    this.sPartIdb = selectedbId;
    if (this.sPartIdb === null) {
      this.tempPartNameb = null;
    } else {
      getBomName({
        BomId: this.sPartIdb
      })
        .then(result => {
          this.sBomName = result;
          console.log('bom Name', this.sBomName);
        })
    }

    this.showDropDownAssigneeb = false;
  }

  
  getLookupResultb() {
    this.recordsListb = [];
    this.message = ''
    getBomLookup({
      Searching: this.searchTermAssigneeb
    })
      .then((result) => {
        if (result.length === 0) {
          this.recordsListb = [];
          this.message= "No Records Found";
        } else {
          this.recordsListb = result;
          this.message = "";
        }
        this.error = undefined;
      })
      .catch((error) => {
        this.error = error;
        this.recordsListb = undefined;
      });
  }

  @track recordsList;
@track searchKey = "";
@api selectedValue = "";
@api selectedRecordId;
@track message;
// onLeave(event) {
//   setTimeout(() => {
//     this.searchKey = "";
//     this.recordsList = null;
//   }, 300);
// }
// @api
// isValid() {
//   var val = true;
//   var input = this.template.querySelector('lightning-input-field');
//   if (this.required && !input.value) {
//     input.reportValidity();
//     val = false;
//   }
//   return val;
// }

// @api
// resetLookup(event) {
//   this.template.querySelector("input").value = "";
//   this.searchKey = null;
//   this.selectedValue = null;
//   this.selectedRecordId = null;
//   this.recordsList = null;
// }
}