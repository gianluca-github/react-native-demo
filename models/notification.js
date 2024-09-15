import moment from 'moment';
import 'moment/locale/it';

class Notification {
  constructor(id, ownerId, title, description, date ) {
    this.id = id;
    this.ownerId = ownerId
    this.title = title;
    this.description = description;
    this.date = date;
  }

  get readableDate() {

    moment.updateLocale('it', null);
    return moment(this.date).format('DD MMMM  YYYY | HH:mm');
  }
}

export default Notification;