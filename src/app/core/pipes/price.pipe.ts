import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'priceFormat',
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number): string {
    const decimalPipe = new DecimalPipe('en-US');

    return '' + decimalPipe.transform(value, '1.2-2');
  }
}
