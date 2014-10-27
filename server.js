var newrelic = require('newrelic');
var express = require('express');
var bodyParser = require('body-parser');
var sendgrid = require('sendgrid')(process.env.SENDGRID_USER, process.env.SENDGRID_PASS);
var app = express();
var http = require('http').Server(app);
var monk = require('monk');

var url = process.env.COMPOSEIO_DB, db;


var getHTML = function(title, country) {
  return [
    '  <table id="Table_01" width="800" height="575" border="0" cellpadding="0" cellspacing="0">',
    '  <tr>',
    '    <td colspan="3"><img src="cid:up" width="800" height="100%" style="display: block"></td>',
    '  </tr>',
    '  <tr>',
    '    <td rowspan="2"><img src="cid:leftSide" width="66" height="502" style="display: block"></td>',
    '    <td height="433">', title, ',<br><br>Mereu ai crezut în mine. Dar mă uit in jurul meu si văd că viitorul pe care mi-l doresc eu nu are nicio șansă in România. Așa că m-am hotărât să plec în ', country.toLowerCase().replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); }) ,'.<br><br>O să-mi fie dor de tine, și ție de mine. Dar țara asta pare să fie prea coruptă ca eu să mai pot reuși să fac ceva pe meritul meu, fără pile și fără șpagă. Că nimeni nu pleacă de drag.<br>Să știi, totuși, că mai există un singur om care îmi dă speranță. Este o personă care mi-a demonstrat că vrea ceea ce vreau și eu. De aceea te rog din suflet ca pe 2 noiembrie să crezi iar în mine și să votezi cu Monica Macovei. <br><br>Vă iubesc și ne vedem cât de curând!',
    '    </td>',
    '    <td height="502" rowspan="2"><img src="cid:location" width="418" style="display: block"></td>',
    '  </tr>',
    '  <tr>',
    '    <td><img src="cid:down" width="100%" height="69" style="display: block"></td>',
    '  </tr>',
    '</table>'
  ].join('');
};

var titles = [
  'Dragă mamă', 'Dragă tată', 'Dragă buni', 'Dragă bunicule', 'Dragă mătușă', 'Dragă unchiule', 'Draga mea', 'Dragul meu'
];

var destinations = [
  'italia', 'spania', 'franta', 'germania', 'anglia'
];

var emailRegxp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

if (url) {
  db = monk(url);

  db.on('error', function (error) {
    console.log('ComposeIO connection error: ', error);
  });

  var letters = db.get('letters');
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
  })
);

app.all('*', function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
  next();
});

app.post('/send', function (request, response) {
  if (typeof request.body.title != "number" || typeof request.body.destination != "number") {
    console.log('dest and title error');
    response.status(500).end();
    return;
  }

  if (request.body.title < titles.length) {
    request.body.title = titles[request.body.title];
  } else {
    console.log('title error');
    response.status(500).end();
    return;
  }

  if (request.body.destination < destinations.length) {
    request.body.destination = destinations[request.body.destination];
  } else {
    console.log('dest error');
    response.status(500).end();
    return;
  }

  if (!emailRegxp.test(request.body.sendTo)) {
    console.log('email error');
    response.status(500).end();
    return;
  }

  letters.insert(
    {
      "ip": request.ip,
      "sendTo": request.body.sendTo,
      "destination": request.body.destination,
      "title": request.body.title
    }
  );

  sendgrid.send({
  to:       request.body.sendTo,
  from:     'no-reply@macoveipresedinte.ro',
  subject:  'Ai primit o scrisoare nouă!',
  files: [
    {
      cid: 'up',
      path: 'postcard/' + request.body.destination + '/up.jpg'
    },
    {
      cid: 'leftSide',
      path: 'postcard/' + request.body.destination + '/leftSide.jpg'
    },
    {
      cid: 'location',
      path: 'postcard/' + request.body.destination + '/location.jpg'
    },
    {
      cid: 'down',
      path: 'postcard/' + request.body.destination + '/down.jpg'
    }
  ],
  html: getHTML(request.body.title, request.body.destination)
}, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
});
  response.status(200).end();
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Logger listening on port %d", 3000);
});
