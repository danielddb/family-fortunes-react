import Quiz from './components/quiz/quiz';
import React from 'react';
import ReactDOM from 'react-dom';
import data from './constants/data';
import style from './base/base.styl';
 
ReactDOM.render(<Quiz quiz={data}/>, document.getElementById('app'));

if (module.hot)
  module.hot.accept();