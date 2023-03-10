import { DateTime } from 'luxon';

export function metaFormat(dateString){
    if(!DateTime.fromISO(dateString, { zone: 'utc' }).isValid) return '';

    return  DateTime.fromISO(dateString, { zone: 'utc' }).toFormat('yyyy-LL-dd');
}

export function dtFormat({ startDate, endDate, locality }){
    const cityText = locality? `, ${locality.en}` : '';
    const start    = DateTime.fromISO(startDate, { zone: 'utc' });

    if(!endDate) return start.toFormat('dd LLL yyyy') + cityText;

    const end         = DateTime.fromISO(endDate, { zone: 'utc' });
    const hasSameYear = start.hasSame(end, 'year') 
;
    const hasSameMonthYear = hasSameYear && start.hasSame(end, 'month');

    if(hasSameMonthYear) return `${start.toFormat('dd')} - ${end.toFormat('dd LLL yyyy')}${cityText}`;
    if(hasSameYear)      return `${start.toFormat('dd LLL')} - ${end.toFormat('dd LLL yyyy')}${cityText}`;

    return `${start.toFormat('dd LLL yyyy')} - ${end.toFormat('dd LLL yyyy')}${cityText}`;
}
