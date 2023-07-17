import LightningDatatable from "lightning/datatable";
import THUMBNAIL from './thumbicon.html';
export default class CustomSupplierDatatable extends LightningDatatable {
    static customTypes = {
        thumb: {
          template: THUMBNAIL
        }};
}