import { LightningElement, api, track, wire } from 'lwc';
import getSupplier from '@salesforce/apex/Supplier.getSupplier';
import searchSupplier from '@salesforce/apex/Supplier.searchSupplier';
import userProfile from '@salesforce/apex/Supplier.currentUserInfo';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';

import upName from '@salesforce/apex/Supplier.updateName';
import upCode from '@salesforce/apex/Supplier.updateCode';
import upAdd from '@salesforce/apex/Supplier.updateAdd';
import upCity from '@salesforce/apex/Supplier.updateCity';
import upState from '@salesforce/apex/Supplier.updateState';
import upCountry from '@salesforce/apex/Supplier.updateCountry';

export default class SiteFacilityUI extends LightningElement {

    // USER
  @track currentUser;
  @track showSUP = false;
/*
  @wire(userProfile)
  currentUserProfile({ data }) {
    if (data) {
      this.currentUser = data;
      console.log(this.currentUser);
      if (this.currentUser === "Custom: Supply Manager") {
        this.showSUP = true;
      } else if (this.currentUser === "System Administrator") {
        this.showSUP = true;
      } else {
        this.showSUP = false;
      }
    }
  }
*/
    openModal = false;
    showModal(event) {
        this.openModal = true;
        this.siteFacilityId = event.currentTarget.dataset.id;
        console.log(this.siteFacilityId + "site facility")
    }
    closeModal() {
        this.openModal = false;
    }

    @api recordId;
    @track contacts;
  
    supplierFav;
    supplierCod;
    supplierAdd;
    supplierCity;
    supplierState;
    supplierCountry;

    siteFacilityId;
    
    refreshFacility;
    iconName = "utility:edit";
    error;
    checkReload = false;
    showLoadingSpinner = false;

    @wire(getSupplier, { currentrecordId: '$recordId' })
    suppliers({ error, data }) {
        if (data) {
            
            this.contacts = data;
            this.refreshFacility=data;
            console.log(this.contacts);
           
        }
        else if (error) {
            this.error = error;

        }
    }

    @track isShowResult = true;
    @api findname = '';
    @track searchList;
    @track isshow = false;
    @track messageResult = false;
    @track isShowResult = true;
    @track showSearchedValues = false;

    handleSearch() {
        this.isShowResult = true;
        this.messageResult = false;
      }
    
      handleSearchChange(event) {
        this.messageResult = false;
        this.findname = event.target.value;
      }

    @wire(searchSupplier, { currentrecordId: '$recordId',isName: '$findname' })
    reqSearch({ data, error }) {
        if (data) {
            console.log(data);
            if (data.length > 0 && this.isShowResult) {
                this.searchList = data;
                console.log("  this.searchList  " + this.searchList );
                this.error = undefined;
                this.showSearchedValues = true;
                this.messageResult = false;
            } else if (data.length == 0) {
               
                this.searchList = [];              
                
                if (this.findname != ""){ 
                    this.showSearchedValues = true;
                    this.messageResult = true;
                }else if(this.findname == ""){
                    this.showSearchedValues = false;
                }
            }
            else if (error) {
                this.error = error;
                this.searchList = undefined;
            }
        }
    }
    
    //method to delete file in the particular record
    handleFileDelete(event) {
        console.log('Doc Id ' + this.siteFacilityId);
        deleteRecord(this.siteFacilityId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Site facility deleted',
                        variant: 'success'
                    })
                )
                this.openModal = false;
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting file',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
                this.openModal = false;
                console.log(error);
            })
            .finally(() => {
                location.reload(true);
            });
    }
   
    tempName;
    handleFacilityName(event){
         this.tempName=event.target.value;
    }

    
    editFacilityName(event) {
        if (event.target.iconName =="utility:check") {
            event.target.iconName = "utility:edit";
           this.supplierFav = event.currentTarget.dataset.name;
            console.log(this.supplierFav);

            let DataID = '[data-name="' +this.supplierFav + '"]';

        let FName = this.template.querySelector(DataID);
       let supId = event.currentTarget.dataset.name;

        console.log('id',supId);
        let v1 = FName.value;
        
        FName.setAttribute("disabled", "disabled");
        FName.removeAttribute("style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
        FName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
         );
         console.log('value',v1);
       upName({sId:supId,sName:v1})
       .then(()=>{
           console.log('update');
           this.refreshApex(this.refreshFacility);
           getRecordNotifyChange(supId);
         //  this.supId=null;
       })
       .catch((error) => {
        console.log(JSON.stringify(error));

    });
      
    }
    else{
        event.target.iconName='utility:check';
         this.supplierFav = event.currentTarget.dataset.name;
        console.log(this.supplierFav);

        let DataID = '[data-name="' + this.supplierFav + '"]';
        let FName=this.template.querySelector(DataID);
        
        let v1 = FName.value;
        console.log('value',v1);
        FName.removeAttribute("disabled");
        FName.removeAttribute("style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
        FName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;;"
         );
    }

 }
 tempCode;
    handleFacilityCode(event){
         this.tempCode=event.target.value;
    }

 editFacilityCode(event) {
        if (event.target.iconName == "utility:check") {
            event.target.iconName = "utility:edit";
          let supId1 = event.currentTarget.dataset.code;
           this.supplierCod= event.currentTarget.dataset.code;
          let DataID = '[data-code="' + this.supplierCod + '"]';

        let AName = this.template.querySelector(DataID);
        let v2= AName.value;
        AName.setAttribute("disabled", "disabled");
        AName.removeAttribute("style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
        AName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;;"
         );
         console.log('value',supId1);
        upCode({sId:supId1,sCode:v2})
        .then(()=>{
            console.log('update');
            this.refreshApex(this.refreshFacility);
            getRecordNotifyChange(supId1);
           // this.supId=null;
        })
        .catch((error)=>{
           console.log(JSON.stringify(error));
        });

        }else{
            event.target.iconName='utility:check';
            this.supplierCod= event.currentTarget.dataset.code;
            let DataID = '[data-code="' + this.supplierCod + '"]';
  
            let AName = this.template.querySelector(DataID);
            let v2= AName.value;
            AName.removeAttribute("disabled");
            AName.removeAttribute("style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
            console.log(v2);
            AName.setAttribute(
                "style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
             );
        }
    }

    tempAdd;
    handleFacilityAdd(event){
        this.tempAdd=event.target.value;
    }
    editFacilityAdd(event) {
      if (event.target.iconName == "utility:check") {
          event.target.iconName = "utility:edit";
         this.supplierAdd=event.currentTarget.dataset.add;
         let DataID = '[data-add="' + this.supplierAdd + '"]';

        let BName = this.template.querySelector(DataID);
        let v3=BName.value;
        let supId2= event.currentTarget.dataset.add;
        BName.setAttribute("disabled", "disabled");
        BName.removeAttribute("style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
        BName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
         );
         upAdd({sId:supId2,sAdd:v3})
         .then(()=>{
            console.log('update');
            this.refreshApex(this.refreshFacility);
            getRecordNotifyChange(supId2);
         })
         .catch((error)=>{
             console.log(JSON.stringify(error));
         });

       }else{
           event.target.iconName='utility:check';
           this.supplierAdd=event.currentTarget.dataset.add;
           let DataID = '[data-add="' + this.supplierAdd + '"]';
  
          let BName = this.template.querySelector(DataID);
          BName.removeAttribute("disabled");
          BName.removeAttribute("style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
           BName.setAttribute(
               "style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
            );

       }

    }

    tempCity;
    handleFacilityCity(event){
        this.tempCity=event.target.value;
    }

    editFacilityCity(event) {
        if (event.target.iconName == "utility:check") {
            event.target.iconName = "utility:edit";
         let supId3= event.currentTarget.dataset.city;
          this.supplierCity=event.currentTarget.dataset.city;
          let DataID = '[data-city="' + this.supplierCity + '"]';

        let CName = this.template.querySelector(DataID);
        let v4 =CName.value; 
        CName.setAttribute("disabled", "disabled");
        CName.removeAttribute("style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
        CName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
         );
         upCity({sId:supId3,sCity:v4})
         .then(()=>{
            console.log('update');
            this.refreshApex(this.refreshFacility);
            getRecordNotifyChange(supId3);
        
        })
        .catch((error)=>{
            console.log(JSON.stringify(error));
        });



    }else{
        event.target.iconName='utility:check';
        this.supplierCity=event.currentTarget.dataset.city;
        let DataID = '[data-city="' + this.supplierCity + '"]';

       let CName = this.template.querySelector(DataID);
       let v4=CName.value;
        console.log(v4);
        CName.removeAttribute("disabled");
        CName.removeAttribute("style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
        CName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
         );

    }
 }

  tempState;
  handleFacilityState(event){
      this.tempState=event.target.value;
  }

  editFacilityState(event) {
        if (event.target.iconName == "utility:check") {
            event.target.iconName = "utility:edit";
            let supId4= event.currentTarget.dataset.state;
           this.supplierState=event.currentTarget.dataset.state;
           let DataID = '[data-state="' + this.supplierState + '"]';

        let DName = this.template.querySelector(DataID);
        let v5 = DName.value;
        DName.setAttribute("disabled", "disabled");
        DName.removeAttribute("style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
        DName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none;background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
         );
         console.log(v5);
           upState({sId:supId4,sState:v5})
           .then(()=>{
            console.log('update');
            this.refreshApex(this.refreshFacility);
            getRecordNotifyChange(supId4);
        
          })
           .catch((error)=>{
            console.log(JSON.stringify(error));
          });

        }else{
            event.target.iconName='utility:check';
            this.supplierState=event.currentTarget.dataset.state;
            let DataID = '[data-state="' + this.supplierState + '"]';
             let DName = this.template.querySelector(DataID);
             let v5=DName.value;
             console.log(v5);
            DName.removeAttribute("disabled");
            DName.removeAttribute("style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
            DName.setAttribute(
                "style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
             );
        }
    }


    tempCountry;
    handleFacilityCountry(event){
        this.tempCountry=event.target.value;
    }
    editFacilityCountry(event) {
        if (event.target.iconName == "utility:check") {
            event.target.iconName = "utility:edit";
            let supId5= event.currentTarget.dataset.country;
          this.supplierCountry=event.currentTarget.dataset.country;
          let DataID = '[data-country="' + this.supplierCountry + '"]';

         let EName = this.template.querySelector(DataID);
         let v6=EName.value;
         EName.setAttribute("disabled", "disabled");
         EName.removeAttribute("style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
         EName.setAttribute(
            "style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none;   background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
          );
          upCountry({sId:supId5,sCountry:v6})
          .then(()=>{
            console.log('update');
            this.refreshApex(this.refreshFacility);
            getRecordNotifyChange(supId5);
        
          })
          .catch((error)=>{
               console.log(JSON.stringify(error));
          });

        }else{
            event.target.iconName='utility:check';
            this.supplierCountry=event.currentTarget.dataset.country;
            let DataID = '[data-country="' + this.supplierCountry + '"]';
  
           let EName = this.template.querySelector(DataID);
           let v6=EName.value;
           console.log(v6);
           EName.removeAttribute("disabled");
           EName.removeAttribute("style"," font-weight: 500; border: 1px; border-color: lightgrey; border-style:none none solid none; background-color: transparent; height:25%; width: 90%; resize:none; outline:none;")
           EName.setAttribute(
             "style"," font-weight: 500; border: 1px; border-style:none none dotted none; background-color: transparent; height:25%; width: 90%; resize:none;  outline:none;"
            );
        }
    }
}