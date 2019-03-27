import { Injectable } from '@angular/core';
import { MatrixReceiptModel } from '../models/pnr/matrix-receipt.model';
import { MatrixAccountingModel } from '../models/pnr/matrix-accounting.model';
import { RemarkGroup } from '../models/pnr/remark.group.model';
import { RemarkModel } from '../models/pnr/remark.model';
import { DatePipe } from '@angular/common';



@Injectable({
    providedIn: 'root',
})
export class PaymentRemarkHelper {

    creditcardMaxValidator(newValue) {
        let pat = '';
        switch (newValue) {
            case 'VI': {
                pat = '^4[0-9]{15}$';
                break;
            }
            case 'MC': {
                pat = '^5[0-9]{15}$';
                break;
            }
            case 'AX': {
                pat = '^3[0-9]{14}$';
                break;
            }
            case 'DC': {
                pat = '^[0-9]{14,16}$';
                break;
            }
            default: {
                pat = '^[0-9]{14,16}$';
                break;
            }
        }
        return pat;
    }

    checkDate(newValue) {
        const datePipe = new DatePipe('en-US');

        const month = datePipe.transform(newValue, 'MM');
        const year = datePipe.transform(newValue, 'yyyy');

        const d = new Date();
        const moNow = d.getMonth();
        const yrnow = d.getFullYear();
        let valid = false;
        if (parseInt(year) > yrnow) {
            valid = true;
        }
        if ((parseInt(year) === yrnow) && (parseInt(month) >= moNow + 1)) {
            valid = true;
        }

        return valid;
    }


}