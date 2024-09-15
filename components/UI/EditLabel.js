import React from 'react';
import Input from './Input';
import TextLabel from './TextLabel';


const EditLabel = props =>{

  const noEdit = props.noEdit

  if( noEdit ){

    return <TextLabel {...props} > {props.initValue}</TextLabel>
  }

  return <Input {...props} />

};

export default EditLabel;