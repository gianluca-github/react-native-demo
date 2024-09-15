import moment from 'moment';
import 'moment/locale/it';


class Order {
  constructor(id, items, totalAmount, date, state, mode ) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = date;
    this.state = state;
    this.mode = mode;
  }


  get readableDate() {
    
    moment.updateLocale('it', null);
    return moment(this.date).format('DD MMMM  YYYY | HH:mm');
  }
}

export default Order;
