import { Pipe, PipeTransform } from '@angular/core';
import { formatSignedAmount } from './signed-amount';

@Pipe({ name: 'signedAmount', standalone: true, pure: true })
export class SignedAmountPipe implements PipeTransform {
  transform(value: number): string {
    return formatSignedAmount(value).text;
  }
}
