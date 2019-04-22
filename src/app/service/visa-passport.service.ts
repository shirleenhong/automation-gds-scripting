import { Injectable } from '@angular/core';
import { PnrService } from './pnr.service';
import { FormGroup } from '@angular/forms';
import { RemarkModel } from '../models/pnr/remark.model';
import { RemarkGroup } from '../models/pnr/remark.group.model';
import { RemarkHelper } from '../helper/remark-helper';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

@Injectable({
    providedIn: 'root'
  })

  export class VisaPassportService {
    formGroup: FormGroup;
    remarkGroup: RemarkGroup;
    datePipe = new DatePipe('en-US');

    constructor(private pnrService: PnrService, private remarkHelper: RemarkHelper) { }

  GetRemarks(form: FormGroup) {
     this.formGroup = form;
     this.remarkGroup = new RemarkGroup();
     this.remarkGroup.group = 'Visa Passport Group';
     this.remarkGroup.remarks = new Array<RemarkModel>();

     if (this.formGroup.controls.originDestination.value === true) {
     // this.AddCitizenship();
     this.AddSegments();
     this.AddAdvisory();
    }
     return this.remarkGroup;
  }

  AddCitizenship(): void {
    this.remarkGroup.remarks.push(this.remarkHelper.createRemark('CITIZENSHIP-' + this.formGroup.controls.citizenship.value, 'RM', 'P'));
  }

  AddAdvisory(): void {
    this.remarkGroup.remarks.push(this.remarkHelper.createRemark('INTERNATIONAL TRAVEL ADVISORY SENT', 'RM', '*'));
    // tslint:disable-next-line:max-line-length
    this.remarkGroup.remarks.push(this.remarkHelper.createRemark('ADVISED ' + this.formGroup.controls.passportName.value + ' VALID PASSPORT IS REQUIRED', 'RM', '*'));

  }

  AddSegments(): void {
    this.formGroup.controls.segments.value.forEach(x => {
      if (x.visa === '') {
        // tslint:disable-next-line:max-line-length
        this.remarkGroup.remarks.push(this.remarkHelper.createRemark(x.country.toUpperCase() + ' - A VALID PASSPORT IS REQUIRED' + '/S' + x.segmentLine, 'RM', '*'));
      } else if (x.visa) {
        // tslint:disable-next-line:max-line-length
        this.remarkGroup.remarks.push(this.remarkHelper.createRemark(x.country.toUpperCase() + ' - A VALID PASSPORT AND VISA ARE REQUIRED' + '/S' + x.segmentLine, 'RM', '*'));
      }
    });
  }
}
