let express = require('express');
bodyParser = require('body-parser');
const cors = require('cors');
let app = express();
const  router = express.Router()


 app.use(bodyParser.json());
 app.use(cors()); // this should solve the cors issues

app.use('/api', require('./routes/apiRoutes'));
app.get('/', (req, res) => res.status(200).send({
    message: 'Testing api'
}));

//This is for seeting up the  serve and the port
const port = process.env.PORT || 3000;

const server = app.listen(port, function(){
    console.log('Listening on port ' + port);
});
