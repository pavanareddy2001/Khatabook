import moment from 'moment';

export function getCurrentTime() {
  return moment(new Date()).format('DD-MM-YYYY, hh:mm:ss A');
}

export function getOnlyNumbers(text = '') {
  return text?.replace(/\D/g, '');
}
