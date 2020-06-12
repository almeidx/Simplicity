import { Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';

export default class DateUtil {
  static getLocale(language: string): Locale {
    switch (language) {
      default:
        return enUS;
    }
  }
}
