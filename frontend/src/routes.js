import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Extrato from './pages/Extrato';

export default function Routes(){
  return(
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Extrato}/>
      </Switch>
    </BrowserRouter>
  )
}



