import { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import moment from 'moment';
import { t } from 'hospitalrun/macro';

export default AbstractIndexRoute.extend({
  editReturn: 'appointments.index',
  modelName: 'appointment',
  newButtonText: computed('intl.locale', () => {
    return t('appointments.buttons.newButton');
  }),
  pageTitle: computed('intl.locale', () => {
    return t('appointments.thisWeek');
  }),

  _getStartKeyFromItem(item) {
    let endDate = item.get('endDate');
    let id = this._getPouchIdFromItem(item);
    let startDate = item.get('startDate');
    if (endDate && endDate !== '') {
      endDate = new Date(endDate);
      if (endDate.getTime) {
        endDate = endDate.getTime();
      }
    }
    if (startDate && startDate !== '') {
      startDate = new Date(startDate);
      if (startDate.getTime) {
        startDate = startDate.getTime();
      }
    }

    return [startDate, endDate, id];
  },

  _modelQueryParams() {
    let endOfWeek = moment().endOf('week').toDate().getTime();
    let startOfWeek = moment().startOf('week').toDate().getTime();
    let maxId = this._getMaxPouchId();
    return {
      options: {
        startkey: [startOfWeek, null, null],
        endkey: [endOfWeek, endOfWeek, maxId]
      },
      mapReduce: 'appointments_by_date'
    };
  },

  actions: {
    editAppointment(appointment) {
      appointment.set('returnTo', this.get('editReturn'));
      this.send('editItem', appointment);
    }
  }
});
