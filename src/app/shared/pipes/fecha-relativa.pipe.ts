import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaRelativa'
})
export class FechaRelativaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
