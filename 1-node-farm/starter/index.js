const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////

// Files

// Blocking, synchronous way

/*const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
console.log(textIn);
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./starter/txt/output.txt', textOut);
console.log('File Written');*/

// Non-blocking, asynchronous

/*fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) =>{
    fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err,data2) => {
        console.log(data2);
    });
});*/

/////////////////////////////////////////

// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true}));

console.log(slugs);

const server = http.createServer((req, res) => {

    const {query, pathname } = url.parse(req.url,true);

    // Overview page
    if(pathname === '/overview' || pathname === '/'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el))
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    
    // Product page
    } else if(pathname === '/product'){
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output);

    // API
    } else if (pathname == '/api'){
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);

    // Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('404 - Page Not Found!');
    }
    
});

server.listen(8000, '127.0.0.1', ( ) => {
  console.log('Listening to request on port 8000');  
});