/* eslint-disable vars-on-top */
/* eslint-disable @lwc/lwc/no-async-operation */
/* eslint-disable no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable eqeqeq */
import { LightningElement, api, wire, track } from "lwc";

import { createRecord } from "lightning/uiRecordApi";
import SUPATTACH_OBJECT from "@salesforce/schema/Supplier_Attachment__c";
import NAME_FIELD from "@salesforce/schema/Supplier_Attachment__c.Name";
import SUPPLIER_FIELD from "@salesforce/schema/Supplier_Attachment__c.Supplier__c";

import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
// import { refreshApex } from "@salesforce/apex";
// import { getRecordNotifyChange } from "lightning/uiRecordApi";

import Search from "@salesforce/apex/supplieratchfile.searchFile";
import getFiles from "@salesforce/apex/supplieratchfile.getCert";
import filesCount from "@salesforce/apex/supplieratchfile.countFiles";
import uploadFile from "@salesforce/apex/supplieratchfile.uploadFile";
import deleteCert from "@salesforce/apex/supplieratchfile.deleteCert";
//import userProfile from "@salesforce/apex/supplieratchfile.currentUserInfo";

//Getting list of permission sets for current logged in user
//import permissionSetName from '@salesforce/apex/GetCurrentUserPermissionSet.permissionSetName';

export default class Supplieratchfile extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  fileList;
  error;

  @track secount = 0;
  @track recount = 0;
  @track searchcount = false;

  // USER

  @track currentUser;
  @track showSUP = false;

  // @wire(userProfile)
  // currentUserProfile({ data }) {
    // if (data) {
    //   this.currentUser = data;
    //   console.log(this.currentUser);
    //   if (this.currentUser === "Custom: Supply Manager") {
    //     this.showSUP = true;
    //   } else if (this.currentUser === "System Administrator") {
    //     this.showSUP = true;
    //   } else {
    //     this.showSUP = false;
    //   }
    // }
  //   if(data) {
  //     data.forEach((permissionname)=>{
  //     //Permission name have to be mentioned Eg:'Custom_Supply_Manager'	
  //       if(permissionname == 'Custom_Supply_Manager' || permissionname == 'Custom_KloudPLM_Administrator') {
  //         this.showSUP  = true;
  //       }
  //     })  
  //   }
  // }

  refreshTable;
  @wire(getFiles)
  refresh(result) {
    this.refreshTable = result;
    console.log("refreshTable " + this.refreshTable);
  }
  countrefresh;
  @wire(filesCount)
  refreshCount(result) {
    this.countrefresh = result;
    console.log("countrefresh " + this.countrefresh);
  }

  handleName(event) {
    this.attachment = event.target.value;
  }

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
      this.attachment = null;
      // this.cNum = null;
      // this.cIssuer = null;
      this.filesUploaded = [];
      this.fileNames = null;
    }
  }
  saveCertification() {
    const fields = {};

    fields[SUPPLIER_FIELD.fieldApiName] = this.recordId;
    fields[NAME_FIELD.fieldApiName] = this.attachment;

    const recordInput = { apiName: SUPATTACH_OBJECT.objectApiName, fields };

    createRecord(recordInput)
      .then((result) => {
        this.cResultId = result.id;
        console.log("this.cResultId " + this.cResultId);
        this.supId = this.recordId;
        console.log("Supplier id after record saved " + this.supId);
        this.handleSaveFiles(this.cResultId);
        this.opencreateCert = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success!!",
            message: "Attachment Created Successfully!!",
            variant: "success"
          })
        );
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
        window.location.reload();
      });
    //location.reload(true);
  }

  createCert() {
    if (this.checkError()) {
      if (this.filesUploaded.length > 0) {
        console.log("this.filesUploaded.length " + this.filesUploaded.length);
        this.saveCertification();
        this.opencreateCert = false;
      } else {
        this.fileNames = "Please select file to upload!!";
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
    console.log(this.filesUploaded);
    uploadFile({ filesToInsert: this.filesUploaded, findingId: pId })
      .then((data) => {
        // this.showLoadingSpinner = false;
        console.log("this.filesUploaded" + this.filesUploaded);
        // this.fileNames = undefined;
      })

      .catch((error) => {
        console.log(JSON.stringify(error));
        alert("Error while uploading File!");
      });
  }

  refreshCertificates;

  @wire(getFiles, { sId: "$recordId" })
  fileView({ error, data }) {
    // this.refreshCertificates = response;
    // let data = response.data;
    if (data) {
      console.log(data);
      this.fileList = data;
      this.searchcount = false;
      this.recount = this.fileList.length;
      console.log(this.fileList[0]);
    } else {
      this.error = error;
    }
  }
  // @track count = 0;
  // @wire(filesCount, { recordId: "$recordId" })
  // crCount({ data }) {
  //   if (data) {
  //     this.count = data;
  //     this.isdata = false;
  //   }
  // }

  //    SEARCH FILES
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
      this.searchcount = false;
      this.showSearchedValues = false;
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
        console.log("this.searchList else " + this.searchList);
        // console.log("searchvalue length" + searchvalue.length);
        this.searchcount = true;
        this.messageResult = true;
        this.showSearchedValues = true;
        // this.showSearchedValues = true;
      }
      // else if (data.length == 0 && searchvalue.length == 0) {
      //   console.log("searchvalue null")
      //   this.messageResult = false;
      //   this.showSearchedValues = false;
      // }

      // this.showSearchedValues = " ";
      // if (this.findname != "") this.messageResult = true;
    });
  }
  getDocBaseUrl = `https://${
    window.location.hostname.split(".")[0]
  }--c.documentforce.com`;
  fileId;
  downloadFile(event) {
    // console.log("down");
    // this.fileId = this.fileList[event.target.dataset.id].Id;
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

  handleUploadFinished(event) {
    const uploadedFiles = event.detail.files;
    console.log("uploadedFiles " + uploadedFiles);
    let uploadedFileNames = "";
    for (let i = 0; i < uploadedFiles.length; i++) {
      uploadedFileNames += uploadedFiles[i].name + ", ";
    }
    console.log("uploadedFileNames " + uploadedFileNames);
    this.openModalh = false;
    this.dispatchEvent(
      new ShowToastEvent({
        title: "Success",
        message:
          uploadedFiles.length +
          " Files uploaded Successfully: " +
          uploadedFileNames,
        variant: "success"
      })
    );
    location.reload(true);
  }

  /** here we are doing row delete action */

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
    })
      .then(() => {
        this.openModal = false;
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success!!",
            message: "Attachement Deleted Successfully!!",
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
      });
    console.log("inside delete");
    location.reload(true);
  }

  //  DELETE FILES

  // handleFileDelete() {
  //   console.log("Doc Id " +this.iddoc);
  //   deleteRecord(this.iddoc)
  //     .then(() => {
  //       this.dispatchEvent(
  //         new ShowToastEvent({
  //           title: "Success",
  //           message: "File deleted",
  //           variant: "success"
  //         })
  //       );
  //       this.openModal = false;
  //     })
  //     .catch((error) => {
  //       this.dispatchEvent(
  //         new ShowToastEvent({
  //           title: "Error deleting file",
  //           message: error.body.message,
  //           variant: "error"
  //         })
  //       );
  //       this.openModal = false;
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       location.reload(true);
  //     });
  // }
}