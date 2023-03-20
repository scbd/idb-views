import { getUnLocale } from '@houlagins/locale'

export default () => scbdCMSLocale() || getUnLocale()


function scbdCMSLocale(){
  if(typeof window === 'undefined') return ''

  return (/\bPreferences\s*=\s*Locale\s*=\s*(\w+)\b/.exec(window.document.cookie||'') || [])[1];
}