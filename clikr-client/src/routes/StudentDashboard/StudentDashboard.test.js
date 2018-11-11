import React from 'react';
import ReactDOM from 'react-dom';
import StudentDashboard from './StudentDashboard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StudentDashboard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
