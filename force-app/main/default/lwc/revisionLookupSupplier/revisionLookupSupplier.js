import {LightningElement,track,api  } from 'lwc';
  import getIngspec from '@salesforce/apex/revisionLookupSupplierClass.getIngProcess';

export default class RevisionLookupSupplier extends LightningElement {
  @api recordId;
    @track recordsList;
  @track searchKey = "";
  @api selectedValue = "";
  @api selectedRecordId;
  @api selectednumber; 
  @api required=false;
  @api iconName;
  @track message;
  onLeave(event) {
    setTimeout(() => {
      this.searchKey = "";
      this.recordsList = null;
    }, 300);
  }
  @api
  isValid() {
    var val = true;
    var input = this.template.querySelector('lightning-input-field');
    if (this.required && !input.value) {
      input.reportValidity();
      val = false;
    }
    return val;
  }
  //holds the record selected by the user
  recordSelection(event) {
    this.selectedRecordId = event.target.dataset.key;
    this.selectedValue = event.target.dataset.name;
    this.selectednumber = event.target.dataset.number;
    this.searchKey = "";
    this.seletedRecordUpdate();
  }
  handleKeyChange(event) {
    const searchKey = event.target.value;
    this.searchKey = searchKey;
    this.getLookupResult();
  }
  removeRecordOnLookup(event) {
    this.searchKey = "";
    this.selectedValue = null;
    this.selectednumber = null;
    this.selectedRecordId = null;
    this.recordsList = null;
    this.seletedRecordUpdate();
  }

  getLookupResult() {
  
   getIngspec({revisionId:this.recordId, search: this.searchKey })
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

  seletedRecordUpdate() {
    const passEventr = new CustomEvent("recordselection", {
      detail: {
        selectedRecordId: this.selectedRecordId,
        selectedValue: this.selectedValue,
        selectednumber:this.selectednumber
      }
    });
    this.dispatchEvent(passEventr);
  }
  @api
  resetLookup(event) {
    this.template.querySelector("input").value = "";
    this.searchKey = null;
    this.selectedValue = null;
    this.selectedRecordId = null;
    this.selectednumber = null;
    this.recordsList = null;
  }
  }