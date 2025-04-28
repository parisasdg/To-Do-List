import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'persianDate',
  standalone: true,
})
export class PersianDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    const faDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);

    return faDate;
  }
}
