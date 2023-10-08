import express from 'express';
import {engine} from 'express-handlebars';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.engine(".hbs", engine({extname: '.hbs'}));
app.set('view engine', ".hbs");
app.set('views', './views')
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.render("index");
});

app.listen(3000);