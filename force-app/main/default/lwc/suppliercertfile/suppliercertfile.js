import { LightningElement, api, wire, track } from "lwc";

import { createRecord } from "lightning/uiRecordApi";
import SCer_Obj from "@salesforce/schema/Supplier_Certification__c";
import SCer_Nam from "@salesforce/schema/Supplier_Certification__c.Name";
import SCer_Num from "@salesforce/schema/Supplier_Certification__c.Certification_Number__c";
import SCer_Iss from "@salesforce/schema/Supplier_Certification__c.Issuer_Name__c";
import SCer_Sup from "@salesforce/schema/Supplier_Certification__c.Supplier__c";

import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from '@salesforce/apex'

import Search from "@salesforce/apex/suppliercertfiles.searchFile";
import getFiles from "@salesforce/apex/suppliercertfiles.getCert";
import filesCount from "@salesforce/apex/suppliercertfiles.countFiles";
import uploadFile from "@salesforce/apex/suppliercertfiles.uploadFile";
import deleteCert from "@salesforce/apex/suppliercertfiles.deleteCert";

export default class Suppliercertfile extends NavigationMixin(LightningElement) 
{
  @api recordId;
  fileList;
  error;

  @track secount = 0;
  @track recount = 0;
  @track searchcount = false;

  // USER
  @track currentUser;
  
  //CREATE CERTIFICATE

  opencreateCert = false;

  showcreateCert() {
    this.opencreateCert = true;
  }
  cancelCert() {
    this.opencreateCert = false;
    this.handleReset();
  }

  handleReset() {
    const inputfields = this.template.querySelectorAll(".resetfield");
    if (inputfields) {
      inputfields.forEach((field) => {
        field.value = "";
      });
      this.cName = null;
      this.cNum = null;
      this.cIssuer = null;
      this.filesUploaded = [];
      this.fileNames = null;
    }
  }

  saveCertification() {
    const fields = {};
    fields[SCer_Nam.fieldApiName] = this.cName;
    fields[SCer_Num.fieldApiName] = this.cNum;
    fields[SCer_Iss.fieldApiName] = this.cIssuer;
    fields[SCer_Sup.fieldApiName] = this.recordId;

    const recordInput = {
      apiName: SCer_Obj.objectApiName,
      fields
    };

    createRecord(recordInput)
      .then((result) => {
        console.log('result.id',result.id);
        this.cResultId = result.id;
        console.log("this.cResultId " + this.cResultId);
        this.supId = this.recordId;
        console.log(
          "this.filesUploaded.length out " + this.filesUploaded.length
        );
        console.log("Supplier id after record saved " + this.supId);

        this.handleSaveFiles(this.cResultId);
        this.opencreateCert = false;
        // refreshApex(this.refreshCertificates);
        // getRecordNotifyChange(this.cResultId);
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success!!",
            message: "Certification Created Successfully!!",
            variant: "success"
          })
        );
        //refreshApex(this.refreshtable);
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      })
      .finally(() => {
        //window.location.reload();
        //refreshApex(this.refreshFiles);
      });
  }

  cName;
  cNum;
  cIssuer;
  cResultId;

  handleName(event) {
    this.cName = event.target.value;
    console.log("supId", this.recordId);
  }
  handleNum(event) {
    this.cNum = event.target.value;
  }
  handleIssuer(event) {
    this.cIssuer = event.target.value;
  }
  createCert() {
    if (this.checkError()) {
      if (this.filesUploaded.length > 0) {
        console.log("this.filesUploaded.length " + this.filesUploaded.length);
        this.saveCertification();
        this.opencreateCert = false;
      } else {
        this.fileNames = "Please select certificate to upload!!";
      }
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

  // UPLOAD FILE

  /** upload file or upload certificate */

  @track fileNames = "";
  @track filesUploaded = [];
  // @track showLoadingSpinner = false;
  fileUpload(event) {
    let files = event.target.files;
    if (files.length > 0) {
      let filesName = "";
      for (let i = 0; i < files.length; i++) {
        let file = files[i];
        filesName = filesName + file.name + ",";
        let freader = new FileReader();
        freader.onload = (f) => {
          let base64 = "base64,";
          let content = freader.result.indexOf(base64) + base64.length;
          let fileContents = freader.result.substring(content);
          this.filesUploaded.push({
            Title: file.name,
            VersionData: fileContents
          });
        };
        freader.readAsDataURL(file);
      }

      this.fileNames = filesName.slice(0, -1);
    }
  }
  handleSaveFiles(pId) {
    //this.showLoadingSpinner = true;
    console.log('this.filesuploaded',this.filesUploaded);
    console.log('pId',pId);
    uploadFile({
      filesToInsert: this.filesUploaded,
      findingId: pId
    })
      .then((data) => {
        // this.showLoadingSpinner = false;
        console.log('Files Saved Successfully');
        // this.fileNames = undefined;
        refreshApex(this.refreshFiles);
        window.location.reload();
      })

      .catch((error) => {
        console.log(JSON.stringify(error));
        alert("Error while uploading File!");
      });
  }

  // LIST VIEW
 refreshFiles;
  @wire(getFiles, {
    sId: "$recordId"
  })
  fileView(result) {
    this.refreshFiles = result;
    // this.refreshCertificates = response;
    // let data = response.data;
    if (result.data) {
      console.log("listdata " + result.data);
      console.log(result.data);
      this.fileList = result.data;
      this.searchcount = false;
      this.recount = this.fileList.length;
      console.log("this.fileList " + this.fileList);
    } else {
      this.error = result.error;
    }
  }

  // COUNT

  @track count = 0;
  @wire(filesCount, {
    recordId: "$recordId"
  })
  crCount({ data }) {
    if (data) {
      this.count = data;
      this.isdata = false;
    }
  }

  //  SEARCH FILES

  @track findname = "";
  @track searchList;
  @track isShowResult = true;
  @track isshow = false;
  @track messageResult = false;
  @track showSearchedValues = false;

  handleClick() {
    this.isShowResult = true;
    this.messageResult = false;
  }

  handleChange(event) {
    this.messageResult = false;
    this.findname = event.target.value;
    // this.findname = searchvalue;
    //  console.log(" this.recordId " + this.recordId);

    if (this.findname.length == 0) {
      //  console.log(" this.findname.length " + this.findname.length);
      console.log("searchvalue null");
      this.messageResult = false;
      this.showSearchedValues = false;
      this.searchcount = false;
    } else {
      this.mynewmethod(this.findname, this.recordId);
    }
  }

  // @wire(Search, { fileName: "$findname", recordId: "$recordId" })
  // searchName({ data }) {
  mynewmethod(searchvalue, recordvalue) {
    Search({
      fileName: searchvalue,
      recordId: recordvalue
    }).then((data) => {
      // console.log("searchdata " + data);
      if (data.length > 0 && this.isShowResult && searchvalue.length > 0) {
        // console.log("data.length " +data.length);
        this.searchList = data;
        this.searchcount = true;
        this.secount = this.searchList.length;
        console.log("this.searchList " + this.searchList);
        // console.log("searchvalue length " + searchvalue.length);
        this.error = undefined;
        this.showSearchedValues = true;
        this.messageResult = false;
      } else if (data.length == 0 && searchvalue.length > 0) {
        this.searchList = [];
        this.secount = this.searchList.length;
        // console.log("data.length " + data.length);
        console.log("this.searchList else " + this.searchList.length);
        // console.log("searchvalue length" + searchvalue.length);
        this.searchcount = true;
        this.messageResult = true;
        this.showSearchedValues = true;
      }
    });
  }

  // DOWNLOAD FILE

  getDocBaseUrl = `https://${
    window.location.hostname.split(".")[0]
  }--c.documentforce.com`;
  fileId;
  downloadFile(event) {
    this.currentfileID = event.currentTarget.dataset.id;
    console.log("this.currentfileID ====> " + this.currentfileID);
    // this.baseUrl = `${this.getDocBaseUrl}/sfc/servlet.shepherd/document/download/${this.currentfileID}`;
    this.baseUrl = `/sfc/servlet.shepherd/document/download/${this.currentfileID}`;
    console.log("fileId", this.baseUrl);
    console.log("fileId", this.currentfileID);
    this[NavigationMixin.Navigate](
      {
        type: "standard__webPage",
        attributes: {
          url: this.baseUrl
        }
      },
      false
    );
  }

  // PREVIEW FILES
  iddoc;
  openModal = false;
  showModal(event) {
    this.openModal = true;
    this.iddoc = this.fileList[event.target.dataset.id].Id;
    console.log("Doc Id " + this.iddoc);
  }
  closeModal() {
    this.openModal = false;
  }
  previewHandler(event) {
    this.currentfileID = event.currentTarget.dataset.id;
    console.log("this.previewHandlerID ====> " + this.currentfileID);
    this[NavigationMixin.Navigate]({
      type: "standard__namedPage",
      attributes: {
        pageName: "filePreview"
      },
      state: {
        selectedRecordId: this.currentfileID
      }
    });
    console.log("field", this.currentfileID);
  }

  // DELETE FILE

  currentrecordID;
  currentfileID;
  handleRow(event) {
    this.openModal = true;
    this.currentrecordID = event.currentTarget.dataset.id;
    this.currentfileID = event.currentTarget.dataset.name;
    console.log("this.currentrecordID ====> " + this.currentrecordID);
    console.log("this.currentfileID ====> " + this.currentfileID);
  }

  handleFileDelete() {
    console.log("currentrecordID ====> " + this.currentrecordID);
    console.log("currentfileID ====> " + this.currentfileID);
    deleteCert({
      ids: this.currentrecordID
      // fids:  this.currentfileID
    })
      .then(() => {
        this.openModal = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success!!",
            message: "Certification Deleted Successfully!!",
            variant: "success"
          })
        );
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error deleting record",
            message: error.body.message,
            variant: "error"
          })
        );
      })
      .finally(() => {
        window.location.reload();
      });
    console.log("inside delete");
  }
}