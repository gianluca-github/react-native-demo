/**
 * 
 * @param {*} objA 
 * @param {*} objB 
 * @returns 
 */
export const equalTo = ( objA, objB ) => {

  if(objA && objB ){
    for( const key in objA ){
      if( objA[key] != objB[key] ){
        return false;
      }
    }
  }

  return true;
}
/**
 * 
 * @param {*} field 
 * @returns 
 */
export const isset =  field  => {
 return ( (typeof field !== 'undefined') );
}

/**
 * 
 * @param {*} str 
 * @param {*} length 
 * @returns 
 */
export const chunkString = (str, length) => {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

/**
 * 
 * @param {*} str 
 * @param {*} length 
 * @returns 
 */
export const substituteDot = (str, length) =>{
  if( str.length > length ){
    return str.substring(0, length) + "..."; 
  }
  return str;
}  