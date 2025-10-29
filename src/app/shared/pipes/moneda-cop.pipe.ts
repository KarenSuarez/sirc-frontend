import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monedaCop'
})
export class MonedaCopPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
