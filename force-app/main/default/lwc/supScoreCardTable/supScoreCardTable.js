import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getData from '@salesforce/apex/newScaClass.getList';
import updatePriceChangesAndContractTermsAreDoc from '@salesforce/apex/newScaClass.updatePriceChangesAndContractTermsAreDoc';
import updateGoodAndServicesArePriceCompetitive from '@salesforce/apex/newScaClass.updateGoodAndServicesArePriceCompetitive';
import updateCostReductionIdeasAreSharedAndReso from '@salesforce/apex/newScaClass.updateCostReductionIdeasAreSharedAndReso';
import updateOnTimeDeliveryToMeetScheduledMater from '@salesforce/apex/newScaClass.updateOnTimeDeliveryToMeetScheduledMater';
import updateUtilizeEffectiveSystemsToMeetProcur from '@salesforce/apex/newScaClass.updateUtilizeEffectiveSystemsToMeetProcur';
import updateNeedsExInventoryAndTransportation from '@salesforce/apex/newScaClass.updateNeedsExInventoryAndTransportation';
import updateProvidesIdeasThatHelpsBuyersOrganiz from '@salesforce/apex/newScaClass.updateProvidesIdeasThatHelpsBuyersOrganiz';
import updateManagementCommitmentAndResponsiveness from '@salesforce/apex/newScaClass.updateManagementCommitmentAndResponsiveness';
import updateAppropriateTechnicalCapabilitiesAndS from '@salesforce/apex/newScaClass.updateAppropriateTechnicalCapabilitiesAndS';
import updateMaintainsIndustryStandardCertificatio from '@salesforce/apex/newScaClass.updateMaintainsIndustryStandardCertificatio';
import updateDemonstratedComplianceWithSpecificati from '@salesforce/apex/newScaClass.updateDemonstratedComplianceWithSpecificati';
import updateCommitedToProcessPerformanceAndCont from '@salesforce/apex/newScaClass.updateCommitedToProcessPerformanceAndCont';
import updateProvidesEffectiveAndTimelyCommunicat from '@salesforce/apex/newScaClass.updateProvidesEffectiveAndTimelyCommunicat';
import updateRespondsToRequestsInTimelyAndEffec from '@salesforce/apex/newScaClass.updateRespondsToRequestsInTimelyAndEffec';

// import GET_SCA from '@salesforce/apex/newScaClass.updateRating';
// import GET_SCACOMMENTS from '@salesforce/apex/newScaClass.updateComments';

export default class SupScoreCardTable extends LightningElement {
    @api recordId;
    @track allData;
    RefreshMilestoneAndTask;
    error;
    // @api searchKey = '';

    @wire(getData, { id: '$recordId' })
    listData(result) {
        this.RefreshMilestoneAndTask = result;
        let data = result.data;
        if (data) {
            this.allData = data;
            console.log(JSON.stringify(this.allData) + ' feedback tab data');

        }
    }

    // @wire(getData, { supId: '$recordId', search: '$searchKey' })
    // listData(response) {
    //     let data = response.data;
    //     console.log(data);

    //     if (data) {

    //         // var tempOppList = [];
    //         // for (var i = 0; i < result.data.length; i++) {
    //         //     let tempRecord = Object.assign({}, result.data[i]); //cloning object
    //         //     tempOppList.push(tempRecord);

    //         // }
    //         this.allData = data;
    //         console.log("allData " + JSON.stringify(this.allData));
    //         this.RefreshMilestoneAndTask = response;

    //     }

    // }


    // Price changes and contract terms are documented and transparent edit and check method //

    // mgmtRating;
    price;
    currentmgmtId;
    iconName = "utility:edit";
    // priceChangesAndContractTermsAreDoc;
    mgmtPriceChange(event) {
        this.price = event.target.value;
        console.log(this.price);
    }

    mgmtPriceEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.price;
            console.log(this.currentmgmtId);
            let DataID = '[data-price="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );  
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                "style",
                "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updatePriceChangesAndContractTermsAreDoc({ id: this.currentmgmtId, price: milestoneUpdatedName })
                    .then((result) => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));
                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.price;
            let DataID = '[data-price="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            // console.log("Inside the another else",this.mName);
            mName.removeAttribute("disabled");
            console.log("Inside the another else",this.mName);
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Good and Services are price competitive edit and check method //

    good;
    // goodAndServicesArePriceCompetitive;
    mgmtGoodChange(event) {
        this.good = event.target.value;
        console.log(this.good);
    }

    mgmtGoodEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.good;
            console.log(this.currentmgmtId);
            let DataID = '[data-good="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if(milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );    
                updateGoodAndServicesArePriceCompetitive({ id: this.currentmgmtId, good: milestoneUpdatedName })
                    .then(() => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.good;
            let DataID = '[data-good="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Cost reduction ideas are shared and resourced //

    cost;
    costReductionIdeasAreSharedAndResourced;
    mgmtCostChange(event) {
        this.cost = event.target.value;
        console.log(this.cost);
    }

    mgmtCostEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.cost;
            console.log(this.currentmgmtId);
            let DataID = '[data-cost="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                "style",
                "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
            );
            updateCostReductionIdeasAreSharedAndReso({id: this.currentmgmtId, cost: milestoneUpdatedName})
                    .then(() => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })

            }

        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.cost;
            let DataID = '[data-cost="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }


    // On time delivery to meet scheduled materials or service requirements //

    delivery;
    ontimeDeliveryToMeetScheduledMaterialsOrServiceRequirements;
    mgmtDeliveryChange(event) {
        this.delivery = event.target.value;
        console.log(this.delivery);
    }

    mgmtDeliveryEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.delivery;
            console.log(this.currentmgmtId);
            let DataID = '[data-delivery="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updateOnTimeDeliveryToMeetScheduledMater({id: this.currentmgmtId, delivery: milestoneUpdatedName})
                    .then((result) => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })

            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.delivery;
            let DataID = '[data-delivery="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }


    //  Utilize effective systems to meet procure to pay needs //

    utilize;
    utilizeEffectiveSystemsToMeetProcureToPayNeeds;
    mgmtUtilizeChange(event) {
        this.utilize = event.target.value;
        console.log(this.utilize);
    }

    mgmtUtilizeEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.utilize;
            console.log(this.currentmgmtId);
            let DataID = '[data-utilize="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }  
            else {
                event.target.iconName = "utility:edit"; 
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updateUtilizeEffectiveSystemsToMeetProcur({ id: this.currentmgmtId, utilize: milestoneUpdatedName })
                    .then((result) => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.utilize;
            let DataID = '[data-utilize="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Needs(ex:inventory and transportation) //

    need;
    needsexinventoryandtransportation;
    mgmtNeedChange(event) {
        this.need = event.target.value;
        console.log(this.need);
    }

    mgmtNeedEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check"){
            this.currentmgmtId = event.currentTarget.dataset.need;
            console.log(this.currentmgmtId);
            let DataID = '[data-need="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );    
                updateNeedsExInventoryAndTransportation({ id: this.currentmgmtId, need: milestoneUpdatedName })
                    .then((result) => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));
                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.need;
            let DataID = '[data-need="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Provides ideas that helps buyers organization acheive desired solutions //

    provide;
    providesIdeasThatHelpsBuyersOrganizationAcheiveDesiredSolutions;
    mgmtProvideChange(event) {
        this.provide = event.target.value;
        console.log(this.provide);
    }

    mgmtProvideEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.provide;
            console.log(this.currentmgmtId);
            let DataID = '[data-provide="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }   
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );    
                updateProvidesIdeasThatHelpsBuyersOrganiz({ id: this.currentmgmtId, provide: milestoneUpdatedName })
                    .then((result) => {
                        console.log("updated");
                            this.dispatchEvent(
                                new ShowToastEvent({
                                    title: 'Success',
                                    message: 'Rating has been updated successfully',
                                    variant: 'Success'
                                })
                            );
                            refreshApex(this.RefreshMilestoneAndTask);
                            getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })

            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.provide;
            let DataID = '[data-provide="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Management Commitment and responsiveness //

    management;
    managementCommitmentAndResponsiveness;
    mgmtManageChange(event) {
        this.management = event.target.value;
        console.log(this.management);
    }

    mgmtManageEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.management;
            console.log(this.currentmgmtId);
            let DataID = '[data-management="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updateManagementCommitmentAndResponsiveness({ id: this.currentmgmtId, management:milestoneUpdatedName })
                    .then((result) => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));
                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.management;
            let DataID = '[data-management="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }
    
    // Appropriate Technical capabilities and skills //

    appropriate;
    appropriateTechnicalCapabilitiesAndSkills;
    mgmtAppropriateChange(event) {
        this.appropriate = event.target.value;
        console.log(this.appropriate);
    }

    mgmtAppropriateEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.appropriate;
            console.log(this.currentmgmtId);
            let DataID = '[data-appropriate="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updateAppropriateTechnicalCapabilitiesAndS({ id: this.currentmgmtId, appropriate: milestoneUpdatedName })
                    .then((result) => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.appropriate;
            let DataID = '[data-appropriate="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Maintains industry standard certification for testing and audits //
  
    maintain;
    maintainsIndustryStandardCertificationForTestingAndAudits;
    mgmtMaintainChange(event) {
        this.maintain = event.target.value;
        console.log(this.maintain);
    }

    mgmtMaintainEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.maintain;
            console.log(this.currentmgmtId);
            let DataID = '[data-maintain="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updateMaintainsIndustryStandardCertificatio({ id: this.currentmgmtId, maintain: milestoneUpdatedName })
                    .then(() => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })

            }

            // location.reload();
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.maintain;
            let DataID = '[data-maintain="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Demonstrated compliance with specifications and quality requirements //

    demo;
    demonstratedComplianceWithSpecificationsAndQualityRequirements;
    mgmtDemoChange(event) {
        this.demo = event.target.value;
        console.log(this.demo);
    }

    mgmtDemoEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.demo;
            console.log(this.currentmgmtId);
            let DataID = '[data-demo="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            } 
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                    "style",
                    "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updateDemonstratedComplianceWithSpecificati({ id: this.currentmgmtId, demo: milestoneUpdatedName })
                    .then(() => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.demo;
            let DataID = '[data-demo="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Commited to process performance and continuous improvement //

    commited;
    commitedToProcessPerformanceAndContinuousImprovement;
    mgmtCommitedChange(event) {
        this.commited = event.target.value;
        console.log(this.commited);
    }

    mgmtCommitedEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.commited;
            console.log(this.currentmgmtId);
            let DataID = '[data-commited="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                "style",
                "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
            );
                updateCommitedToProcessPerformanceAndCont({ id: this.currentmgmtId, commited: milestoneUpdatedName })
                    .then(() => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })

            }

            // location.reload();
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.commited;
            let DataID = '[data-commited="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Provides effective and timely communication regarding changes //
    eff;
    providesEffectiveAndTimelyCommunicationRegardingChanges;
    mgmtEffChange(event) {
        this.eff = event.target.value;
        console.log(this.eff);
    }

    mgmtEffEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.eff;
            console.log(this.currentmgmtId);
            let DataID = '[data-eff="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName="utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                "style",
                "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
            );
                updateProvidesEffectiveAndTimelyCommunicat({ id: this.currentmgmtId, eff: milestoneUpdatedName })
                    .then(() => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })
            }
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.eff;
            let DataID = '[data-eff="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // Responds to requests in timely and effective manner //

    respond;
    respondsToRequestsInTimelyAndEffectiveManner;
    mgmtRespondChange(event) {
        this.respond = event.target.value;
        console.log(this.respond);
    }

    mgmtRespondEdit(event) {
        //when user clicks on save
        // eslint-disable-next-line
        console.log("in edit method");
        if (event.target.iconName == "utility:check") {
            this.currentmgmtId = event.currentTarget.dataset.respond;
            console.log(this.currentmgmtId);
            let DataID = '[data-respond="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            let milestoneUpdatedName = mName.value;
            console.log(milestoneUpdatedName + " the value");
            if (milestoneUpdatedName > 5 || milestoneUpdatedName < 0) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Give a rating only between 0-5',
                        variant: 'error'
                    })
                );
            }
            else {
                event.target.iconName = "utility:edit";
                mName.setAttribute("disabled", "disabled");
                mName.setAttribute(
                "style",
                "border-style: none;  resize: none;  background-color: transparent;  font-size: small;  max-width:20%;"
                );
                updateRespondsToRequestsInTimelyAndEffec({ id: this.currentmgmtId, respond: milestoneUpdatedName })   
                    .then(() => {
                        console.log("updated");
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Rating has been updated successfully',
                                variant: 'Success'
                            })
                        );
                        refreshApex(this.RefreshMilestoneAndTask);
                        getRecordNotifyChange(this.currentmgmtId);
                    })
                    .catch((error) => {
                        console.log(JSON.stringify(error));

                    })

            }

            // location.reload();
        }
        //when the icon is in edit mode
        else {
            event.target.iconName = "utility:check";
            this.currentmgmtId = event.currentTarget.dataset.respond;
            let DataID = '[data-respond="' + this.currentmgmtId + '"]';
            let mName = this.template.querySelector(DataID);
            mName.removeAttribute("disabled");
            mName.setAttribute(
                "style",
                "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size:small;  max-width:20%;"
            );
        }
    }

    // saveDetails() {
    //     location.reload();
    // }
}
    // mgmtComments;


    // mgmtCommentsChange(event) {
    //     this.mgmtComments = event.target.value;
    //     console.log(this.mgmtComments);
    // }

    // mgmtCommentsEdit(event) {
    //     //when user clicks on save
    //     // eslint-disable-next-line
    //     if (event.target.iconName == "utility:check") {
    //         event.target.iconName = "utility:edit";

    //         this.currentmgmtId = event.currentTarget.dataset.comments;
    //         console.log(this.currentmgmtId);

    //         let DataID = '[data-comments="' + this.currentmgmtId + '"]';

    //         let mName = this.template.querySelector(DataID);
    //         let milestoneUpdatedName = mName.value;
    //         console.log(milestoneUpdatedName);

    //         mName.setAttribute("disabled", "disabled");
    //         mName.setAttribute(
    //             "style",
    //             "border-style: none;  resize: none;  background-color: transparent;  font-size: small; max-width:30%;"
    //         );

    //         GET_SCACOMMENTS({
    //             sfaId: this.currentmgmtId,
    //             comments: milestoneUpdatedName
    //         })
    //             .then(() => {
    //                 console.log("updated");
    //                 refreshApex(this.RefreshMilestoneAndTask);
    //                 getRecordNotifyChange(this.currentmgmtId);
    //             })
    //             .catch((error) => {
    //                 console.log(JSON.stringify(error));
    //             })

    //     }
    //     //when the icon is in edit mode
    //     else {
    //         event.target.iconName = "utility:check";

    //         this.currentmgmtId = event.currentTarget.dataset.comments;
    //         let DataID = '[data-comments="' + this.currentmgmtId + '"]';

    //         let mName = this.template.querySelector(DataID);
    //         mName.removeAttribute("disabled");
    //         mName.setAttribute(
    //             "style",
    //             "border:1px;  resize:none; border-style:none none dotted none; outline:none; font-size: small; max-width:30%;"
    //         );
    //     }
    // }

    // handleSearch(event) {
    //     this.searchKey = event.target.value;
    //     console.log(this.searchKey + ' search String');
    // }