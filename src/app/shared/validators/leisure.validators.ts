import { FormControl, Validators, ValidatorFn, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { SegmentService } from 'src/app/service/segment.service';
import { isUndefined } from 'ngx-bootstrap/chronos/utils/type-checks';



export function validateSegmentNumbers(segments: any[]): ValidatorFn {
    return (currentControl: AbstractControl): { [key: string]: any } => {
        if (currentControl.value === undefined) { return { no_value: true }; }
        if (segments === undefined || segments.length === 0) { return { no_segments: true }; }
        let response = null;
        const segs = currentControl.value.toString().split(',');
        segs.forEach(x => {
            const s = segments.find(z => z.lineNo === x);
            if (s == null || s === undefined) {
                response = { segment_not_found: true };
                return response;
            }
        });

        return response;
    };
}
