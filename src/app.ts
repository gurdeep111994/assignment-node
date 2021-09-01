let express = require('express');
const app = express();
const bodyParser = require('body-parser');
var fs = require('fs');
const port = 3000;

// applying middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('*', checkUserPath);


// function for check specfic routes and call middleware for matched base url's
function checkUserPath(req, res, next) {
    // accessing base url and session from req
    const { baseUrl } = req;
    if ((baseUrl.includes('api/proxy') || baseUrl.includes('pub/proxy'))) {
        req.headers.session ? next() : res.end('Route not found!');
    } else {
        next();
    }
}

// routes
app.get('/', (req, res) => {
    res.send('Hello!');
});

// read json from file
app.get('/:id', (req, res) => {
    const { id } = req.params;
    const file = `${id}.json`;
    if (!fs.existsSync(file)) { 
        return res.send('File not exist');
    }
    fs.readFile(`${id}.json`, 'utf8', function readFileCallback(err, data) {
        if (err) {
            res.send('someting went wrong');
        } else {
            res.send(data);
        }
    });
    console.log(req.params.id);

});

// create json file from req.body
app.post('/save/:id', (req, res) => {
    const { id } = req.params;
    fs.writeFile(`${id}.json`, JSON.stringify(req.body), 'utf8', function (err) {
        res.send(err ? 'someting went wrong' : 'File created successfully');
    });
});

app.get('/api/proxy/*', (req, res) => {
    res.send(`you requested for route started with '/api/proxy'`);
});

app.get('/pub/proxy/*', (req, res) => {
    res.send(`you requested for route started with '/pub/proxy'`);
});

// listening 3000 port
app.listen(port, (err: any) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});