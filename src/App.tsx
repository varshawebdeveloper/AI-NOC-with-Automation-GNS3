import React from 'react';

// Suppress TSX resolution error when '--jsx' is not set by using a runtime require
// @ts-ignore
const { AppRoutes } = require('./routes/AppRoutes');

const App: React.FC = () => React.createElement(AppRoutes);

export default App;
