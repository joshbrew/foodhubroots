/* 
    esbuild + nodejs development server. 
    Begin your javascript application here. This file serves as a simplified entry point to your app, 
    all other scripts you want to build can stem from here if you don't want to define more entryPoints 
    and an outdir in the bundler settings.

    Just ctrl-A + delete all this to get started on your app.

*/

import './index.css'; //compiles with esbuild, just link the stylesheet in your index.html (the boilerplate shows this example)
import './components/productlisting/tablecomponent';
import './components/categorygen/categorygen';
import {sampleItemListing} from './data';

let cat = document.createElement('category-select');
cat.productData = [sampleItemListing];
document.body.appendChild(cat);

let products = document.createElement('product-listing');
products.productData = [sampleItemListing];
document.body.appendChild(products);