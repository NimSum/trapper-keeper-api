import app from './app'; // all the requests and methods needed to communicate with the client are within the express app

app.set('port', process.env.PORT || 3000); // set the port to the current process env PORT or 3000
// listen for get request
app.listen(app.get('port'), () => { // listen for the port
  // log this message and interpolate the current port that was set
  console.log(`Something is running on http://localhost:${app.get('port')}`);
})




