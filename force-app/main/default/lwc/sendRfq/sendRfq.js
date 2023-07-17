// import { LightningElement } from 'lwc';

// export default class SendRfq extends LightningElement {}
import { LightningElement, api, wire, track } from 'lwc';
import sendEmail from '@salesforce/apex/sendRfq.sendEmail';
import getData from '@salesforce/apex/sendRfq.getList';
import getEmail from '@salesforce/apex/sendRfq.supplierEmail';
import currentUser from '@salesforce/apex/sendRfq.currentUserInfo';
import { convertToCSV } from 'c/utils';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SendRfq extends LightningElement {
    @api recordId;
    @track partData = [];
    @api searchKey = '';
    @track email = '';
    @track currentUser = '';

    @wire(getEmail, { supId: '$recordId' })
    supplierEmail({ data, error }) {
        if (data) {
            this.email = data;
            console.log("email " + this.email);
        }
        else if (error) {
            console.error(error);
        }
    }

    @wire(currentUser)
    userName({ data, error }) {
        if (data) {
            this.currentUser = data;
            console.log(this.currentUser + ' current username');
        }
    }

    @wire(getData, { supId: '$recordId', search: '$searchKey' })
    parts(response) {
        let data = response.data;
        if (data) {
            var tempList = [];
            for (let i = 0; i < data.length; i++) {
                let tem = Object.assign({}, data[i]);
                tempList.push(tem);
            }
            this.partData = tempList;
            console.log(JSON.stringify(this.partData));
        }
    }

    handleSearch(event) {
        this.searchKey = event.target.value;
        console.log(this.searchKey + ' search String');
    }

    handleCheckbox(event) {
        let id = event.target.dataset.iid;
        console.log(id + ' id');
        let dd = this.template.querySelector('[data-id="' + id + '"]');
        console.log(dd + ' dd');
        console.log(dd.name + ' ddname');
        if (id == dd.name && event.target.checked == true) {
            dd.disabled = false;
            console.log(dd.disabled + 'in if');
        }
        if (id == dd.name && event.target.checked == false) {
            dd.disabled = true;
            console.log(dd.disabled + 'in else');
        }

    }

    handleQty(event) {
        let id = event.target.dataset.id;
        this.partData.forEach(element => {
            if (id == element.recId) {
                console.log('in if');
                element.recQty = event.target.value;
            }
        });
    }

    @track result = [];
    handleDone() {

        this.partData.forEach(element => {
            if (element.recQty !== '') {
                let sObject = { 'recName': element.recName, 'recNumber': element.recNumber, 'recQty': element.recQty };
                this.result.push(sObject);
                console.log(JSON.stringify(this.result));

            }
        });

        console.log(JSON.stringify(this.result));
    }

    partHeaders =
        {
            // recId: "Record Id",
            recName: "Name",
            //recNumber: "Number",
            recQty: "Quantity"

        };


    doneClick() {
        // send mail
        console.log("in done");
        this.partData.forEach(element => {
            if (element.recQty !== '') {
                let sObject = { 'recName': element.recName, 'recNumber': element.recNumber, 'recQty': element.recQty };
                this.result.push(sObject);
                console.log(JSON.stringify(this.result));

            }
        });
        console.log(JSON.stringify(this.result) + " selected records");
        console.log("Sending email to", this.email);
        // console.log("list data " + this.listStore);
        console.log("part headers " + this.partHeaders);
        convertToCSV(this.result, this.partHeaders);
        console.log("exported" + convertToCSV(this.result, this.partHeaders));
        sendEmail({ toAddress: this.email, subject: "Quotation required", body: 'Please find the attachment!!', file: 'Part Detail Quotation.csv', recordString: convertToCSV(this.result, this.partHeaders) })
            .then(() => {
                setTimeout(() => {

                }, 3000);
                console.log('email sent to the supplier');
                sendEmail({ toAddress: this.currentUser, subject: "Quotation sent to the supplier", body: 'Here is a copy of your responses to the supplier.', file: 'Part Detail Quotation.csv', recordString: convertToCSV(this.result, this.partHeaders) })
                    .then(() => {
                        setTimeout(() => {

                        }, 3000);
                        console.log('email sent to the record owner');
                    })
                    .catch(error => {
                        console.log(error);
                    })
                setTimeout(() => {

                }, 3000);
                location.reload();

            })
            .catch(error => {
                console.log(error);
            })
    }
    @track showPopup = false;
    btnClik(event){
        this.showPopup = true;
    }
    closeModal(){
        this.showPopup = false;
    }
}