import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// This is the test case to check if the App component renders without crashing

it('renders without crashing', () => {
  const div = document.createElement("div"); // Create a div element to render the App component
  ReactDOM.render(<App />, div); // Renders the App component inside the div element
  ReactDOM.unmountComponentAtNode(div); // Unmounts and clean up the rendered component from the div
});
