import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './ui/App';

const app = async () => {

    // Create a root element
    const rootElement = document.getElementById('app');

    let root = createRoot(rootElement);
    // Render the Login component
    root.render(
        <App/>
    );

}

app();