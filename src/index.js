const express = require('express');
const path    = require('path');

const app = express();

const publicDirPath = path.join(__dirname, '../public');

//Serving the static dir
app.use(express.static(publicDirPath));


//Routes

app.get('',(req , res) => {
  res.send('index');
});






const PORT = process.env.PORT || 3000;
app.listen(PORT,() => console.log(`Server running on port : http://localhost:${PORT}`));
