class Product {
   constructor(id, ownerId, title, imageUrl, description, price, qta, unit, scaleQta, cool ) {
     this.id = id;
     this.ownerId = ownerId;
     this.imageUrl = imageUrl;
     this.title = title;
     this.description = description;
     this.price = price;
     this.qta = qta; //available quantity
     this.unit = unit;
     this.scaleQta = scaleQta;
     this.cool = cool;
   }
 }
 
 export default Product;