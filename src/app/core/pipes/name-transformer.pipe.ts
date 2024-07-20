import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameTransformer',
  standalone: true,
})
export class NameTransformerPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    let names = value.split(' ');
    let firstName =
      names[0].charAt(0).toUpperCase() + names[0].slice(1).toLowerCase();
    let lastName =
      names[1].charAt(0).toUpperCase() + names[1].slice(1).toLowerCase();

    return `${lastName}, ${firstName}`;
  }
}
