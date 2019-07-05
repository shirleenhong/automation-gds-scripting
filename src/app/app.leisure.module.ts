import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { LeisureComponent } from './leisure/leisure.component';
import { ReportingComponent } from './leisure/reporting/reporting.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentComponent } from './leisure/payments/payment.component';
import { RemarkComponent } from './leisure/remarks/remark.component';
import { TourPackageComponent } from './leisure/remarks/tour-package/tour-package.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MatrixReceiptComponent } from './leisure/payments/matrix-receipt/matrix-receipt.component';
import { UpdateMatrixReceiptComponent } from './leisure/payments/update-matrix-receipt/update-matrix-receipt.component';
import { PassiveSegmentsComponent } from './passive-segments/passive-segments.component';
import { AccordionModule, ModalModule, TabsModule, BsDatepickerModule, BsDropdownModule } from 'ngx-bootstrap';
import { UpdateAccountingRemarkComponent } from './leisure/payments/update-accounting-remark/update-accounting-remark.component';
import { AccountingRemarkComponent } from './leisure/payments/accounting-remark/accounting-remark.component';
import { LeisureFeeComponent } from './leisure/payments/leisure-fee/leisure-fee.component';
import { ItcPackageComponent } from './leisure/remarks/itc-package/itc-package.component';
import { CCDateExpMaskDirective } from './directives/cc-date-exp-mask.directive';
import { AmountMaskDirective } from './directives/amount-mask.directive';
import { NumberOnlyMaskDirective } from './directives/number-only-mask.directive';
import { AlphaNumericMaskDirective } from './directives/alpha-numeric-mask.directive';
import { ConciergeUdidsComponent } from './leisure/reporting/concierge-udids/concierge-udids.component';
import { AmountPipe } from './pipes/amount.pipe';
import { SegmentsComponent } from './passive-segments/segments/segments.component';
import { UpdateSegmentComponent } from './passive-segments/update-segment/update-segment.component';
import { AllCapsMaskDirective } from './directives/all-caps-mask.directive';
import { MessageComponent } from './shared/message/message.component';
import { CodeshareComponent } from './leisure/remarks/codeshare/codeshare.component';
import { SegmentSelectComponent } from './shared/segment-select/segment-select.component';
import { AlphaMaskDirective } from './directives/alpha-only-mask.directive';
import { VisaPassportComponent } from './leisure/remarks/visa-passport/visa-passport.component';
import { MatrixInvoiceComponent } from './leisure/invoice/matrix-invoice.component';
import { PassengerSelectComponent } from './shared/passenger-select/passenger-select.component';
import { FareRuleSegmentComponent } from './leisure/remarks/fare-rule-segment/fare-rule-segment.component';
import { UpdateFareRuleSegmentComponent } from './leisure/remarks/update-fare-rule-segment/update-fare-rule-segment.component';
import { RbcPointsRedemptionComponent } from './leisure/remarks/rbc-points-redemption/rbc-points-redemption.component';
import { UpdateRbcPointsRedemptionComponent } from './leisure/remarks/update-rbc-points-redemption/update-rbc-points-redemption.component';
import { UpdateLeisureFeeComponent } from './leisure/payments/update-leisure-fee/update-leisure-fee.component';
import { ItineraryComponent } from './leisure/itinerary-and-queue/itinerary/itinerary.component';
import { ItineraryAndQueueComponent } from './leisure/itinerary-and-queue/itinerary-and-queue.component';
import { QueueComponent } from './leisure/itinerary-and-queue/queue/queue.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { CancelComponent } from './leisure/cancel/cancel.component';
import { RefundComponent } from './leisure/cancel/refund/refund.component';
import { CancelSegmentComponent } from './leisure/cancel/cancel-segment/cancel-segment.component';
import { AssociatedRemarksComponent } from './leisure/remarks/associated-remarks/associated-remarks.component';

@NgModule({
  declarations: [
    LeisureComponent,
    ReportingComponent,
    PassiveSegmentsComponent,
    RemarkComponent,
    TourPackageComponent,
    PaymentComponent,
    MatrixReceiptComponent,
    UpdateMatrixReceiptComponent,
    PassiveSegmentsComponent,
    UpdateAccountingRemarkComponent,
    AccountingRemarkComponent,
    LeisureFeeComponent,
    ItcPackageComponent,
    CCDateExpMaskDirective,
    AmountMaskDirective,
    NumberOnlyMaskDirective,
    AlphaNumericMaskDirective,
    AllCapsMaskDirective,
    ConciergeUdidsComponent,
    AmountPipe,
    CancelSegmentComponent,
    SegmentsComponent,
    UpdateSegmentComponent,
    MessageComponent,
    LoadingComponent,
    VisaPassportComponent,
    CodeshareComponent,
    SegmentSelectComponent,
    AlphaMaskDirective,
    FareRuleSegmentComponent,
    UpdateFareRuleSegmentComponent,
    MatrixInvoiceComponent,
    PassengerSelectComponent,
    RbcPointsRedemptionComponent,
    UpdateRbcPointsRedemptionComponent,
    UpdateLeisureFeeComponent,
    ItineraryComponent,
    ItineraryAndQueueComponent,
    QueueComponent,
    CancelComponent,
    RefundComponent,
    AssociatedRemarksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    // ,{ provide: TourPackageRemarksService }
  ],
  bootstrap: [],
  exports: [
    CCDateExpMaskDirective,
    AmountMaskDirective,
    NumberOnlyMaskDirective,
    AlphaNumericMaskDirective,
    AllCapsMaskDirective,
    AlphaMaskDirective,
    LeisureComponent
  ],
  entryComponents: [
    UpdateMatrixReceiptComponent,
    UpdateAccountingRemarkComponent,
    UpdateSegmentComponent,
    MessageComponent,
    LoadingComponent,
    UpdateFareRuleSegmentComponent,
    UpdateRbcPointsRedemptionComponent,
    UpdateLeisureFeeComponent
  ]
})
export class AppLeisureModule {}
