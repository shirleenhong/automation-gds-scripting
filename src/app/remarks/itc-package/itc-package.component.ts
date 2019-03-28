import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-itc-package',
  templateUrl: './itc-package.component.html',
  styleUrls: ['./itc-package.component.scss']
})
export class ItcPackageComponent implements OnInit {

  itcForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.itcForm = this.fb.group({
      noAdult: new FormControl('', []),
      noChild: new FormControl('', []),
      noInfant: new FormControl('', []),
      baseAdult: new FormControl('', []),
      baseChild: new FormControl('', []),
      baseInfant: new FormControl('', []),
      taxAdult: new FormControl('', []),
      taxChild: new FormControl('', []),
      taxInfant: new FormControl('', []),
      bcruiseAdult: new FormControl('', []),
      bcruiseChild: new FormControl('', []),
      bcruiseInfant: new FormControl('', []),
      tcruiseAdult: new FormControl('', []),
      tcruiseChild: new FormControl('', []),
      tcruiseInfant: new FormControl('', []),
      railAdult: new FormControl('', []),
      railChild: new FormControl('', []),
      railInfant: new FormControl('', []),
      insAdult: new FormControl('', []),
      insChild: new FormControl('', []),
      insInfant: new FormControl('', []),
      hotelAdult: new FormControl('', []),
      carAdult: new FormControl('', []),
      depAdult: new FormControl('', []),
      balance: new FormControl('', []),
      dueDate: new FormControl('', []),
      commission: new FormControl('', [])
    });
  }

  ngOnInit() {
    this.itcForm.patchValue({ noAdult: '1' });
    this.itcForm.patchValue({ noAdult: '1' });
    this.itcForm.patchValue({ noChild: '1' });
    this.itcForm.patchValue({ noInfant: '1' });
    this.itcForm.patchValue({ baseAdult: '1' });
    this.itcForm.patchValue({ baseChild: '1' });
    this.itcForm.patchValue({ baseInfant: '1' });
    this.itcForm.patchValue({ taxAdult: '1' });
    this.itcForm.patchValue({ taxChild: '1' });
    this.itcForm.patchValue({ taxInfant: '1' });
    this.itcForm.patchValue({ bcruiseAdult: '1' });
    this.itcForm.patchValue({ bcruiseChild: '1' });
    this.itcForm.patchValue({ bcruiseInfant: '1' });
    this.itcForm.patchValue({ tcruiseAdult: '1' });
    this.itcForm.patchValue({ tcruiseChild: '1' });
    this.itcForm.patchValue({ tcruiseInfant: '1' });
    this.itcForm.patchValue({ railAdult: '1' });
    this.itcForm.patchValue({ railChild: '1' });
    this.itcForm.patchValue({ railInfant: '1' });
    this.itcForm.patchValue({ insAdult: '1' });
    this.itcForm.patchValue({ insChild: '1' });
    this.itcForm.patchValue({ insInfant: '1' });
    this.itcForm.patchValue({ hotelAdult: '1' });
    this.itcForm.patchValue({ carAdult: '1' });


    this.itcForm.patchValue({ commission: '100' });

  }

  get f() {
    return this.itcForm.controls;
  }

  ComputeBalance() {
    let totalBalance = 0;
    totalBalance = this.ComputeAdult() + this.ComputeChild() + this.ComputeInfant();
    if (this.f.depAdult.value) { totalBalance = totalBalance - Number(this.f.depAdult.value); }
    // this.f.balance.value = totalBalance.toString();
    this.itcForm.controls['balance'].setValue(totalBalance);
  }

  ComputeAdult() {
    let adultsum = 0;
    if (this.f.noAdult.value) {
      if (this.f.baseAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.baseAdult.value)); }
      if (this.f.taxAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.taxAdult.value)); }
      if (this.f.bcruiseAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.bcruiseAdult.value)); }
      if (this.f.tcruiseAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.tcruiseAdult.value)); }
      if (this.f.railAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.railAdult.value)); }
      if (this.f.insAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.insAdult.value)); }
      if (this.f.hotelAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.hotelAdult.value)); }
      if (this.f.carAdult.value) { adultsum = adultsum + (Number(this.f.noAdult.value) * Number(this.f.carAdult.value)); }
    }
    return adultsum;
  }

  ComputeChild() {
    let childsum = 0;
    if (this.f.noChild.value) {
      if (this.f.baseChild.value) { childsum = childsum + (Number(this.f.noAdult.value) * Number(this.f.baseAdult.value)); }
      if (this.f.taxChild.value) { childsum = childsum + (Number(this.f.noAdult.value) * Number(this.f.taxAdult.value)); }
      if (this.f.bcruiseChild.value) { childsum = childsum + (Number(this.f.noAdult.value) * Number(this.f.bcruiseAdult.value)); }
      if (this.f.tcruiseChild.value) { childsum = childsum + (Number(this.f.noAdult.value) * Number(this.f.tcruiseAdult.value)); }
      if (this.f.railChild.value) { childsum = childsum + (Number(this.f.noAdult.value) * Number(this.f.railAdult.value)); }
      if (this.f.insChild.value) { childsum = childsum + (Number(this.f.noAdult.value) * Number(this.f.insAdult.value)); }
    }
    return childsum;
  }

  ComputeInfant() {
    let infantsum = 0;
    if (this.f.noInfant.value) {
      if (this.f.baseInfant.value) { infantsum = infantsum + (Number(this.f.noAdult.value) * Number(this.f.baseAdult.value)); }
      if (this.f.taxInfant.value) { infantsum = infantsum + (Number(this.f.noAdult.value) * Number(this.f.taxAdult.value)); }
      if (this.f.bcruiseInfant.value) { infantsum = infantsum + (Number(this.f.noAdult.value) * Number(this.f.bcruiseAdult.value)); }
      if (this.f.tcruiseInfant.value) { infantsum = infantsum + (Number(this.f.noAdult.value) * Number(this.f.tcruiseAdult.value)); }
      if (this.f.railInfant.value) { infantsum = infantsum + (Number(this.f.noAdult.value) * Number(this.f.railAdult.value)); }
      if (this.f.insInfant.value) { infantsum = infantsum + (Number(this.f.noAdult.value) * Number(this.f.insAdult.value)); }
    }
    return infantsum;
  }

}
