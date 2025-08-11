import path from 'path';
import fs from 'fs';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// This is our main React component for both server and client
import App from './src/App.js';

const PORT = process.env.PORT || 3000;
const app = express();

// Our initial data for the todo app. In a real app, this would come from a database.
const initialTodos = ['Learn React SSR', 'Build a Todo App'];

// Tell Express to serve the static bundle from the 'dist' folder
app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/', (req, res) => {
  // Render the React component to a string
  const appContent = ReactDOMServer.renderToString(<App initialTodos={initialTodos} />);

  // Read the HTML template
  const indexHtmlFile = path.resolve('./src/index.html');
  fs.readFile(indexHtmlFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Something went wrong');
    }

    // Replace the root div with the rendered content
    const finalHtml = data.replace(
      '<div id="root"></div>',
      `<div id="root">${appContent}</div>`
    );

    // Inject the initial data into a script tag for the client to read
    const finalHtmlWithData = finalHtml.replace(
      '<body>',
      `<body><script>window.__INITIAL_DATA__ = ${JSON.stringify(initialTodos)};</script>`
    );
    
    return res.send(finalHtmlWithData);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});