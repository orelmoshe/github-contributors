const express = require('express');
const router = require('./routes/routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/.'));


app.use('/', router);

app.listen(process.env.PORT || PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
