import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'priceFormat',
})
export class PriceFormatPipe implements PipeTransform {
  /**
   * Transforms a number value into a formatted price string.
   * @param {number} value - The number to be formatted.
   * @returns {string} - The formatted price string.
   */
  transform(value: number): string {
    // Create a DecimalPipe instance with US locale
    const decimalPipe = new DecimalPipe('en-US');

    // Format the value as a price with 2 decimal places
    return '' + decimalPipe.transform(value, '1.2-2');
  }
}
