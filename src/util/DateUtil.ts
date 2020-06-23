import { Locale, formatDistance, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export default class DateUtil {
  static getLocale(language: string): Locale {
    switch (language) {
      default:
        return enUS;
    }
  }

  static formatDiff(date: Date, locale: Locale): string {
    return `${format(date, 'PPPP', { locale })} (${formatDistance(date, new Date(), { locale })})`;
  }
}
