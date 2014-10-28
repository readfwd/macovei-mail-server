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
    '<body style="background: #FFFFFF; font-family: sans-serif; margin: 0px 0 0 0px; padding: 0px 0 0" bgcolor="#FFFFFF">',
    '<style type="text/css">',
    'body {',
    'margin-top: 0px !important; padding-top: 0px !important;',
    '}',
    'body {',
    'background-color: #FFFFFF; margin-top: 0px !important; padding-top: 0px !important; font-family: sans-serif;',
    '}',
    '</style>',
    '<img src="http://t.inkbrush.com/p/cp/a4ac3cbb91f43afb/o.gif" width="1" height="1"><div class="mi-desktop" style="display: block">',
    '<table width="100%" cellspacing="0" cellpadding="0" align="center" style="background: #FFFFFF; border-collapse: collapse; border-spacing: 0px; border: 0px none; margin: 0px; padding: 0px" bgcolor="#FFFFFF"><tbody><tr align="center" style="border-collapse: collapse; border-spacing: 0px; border: 0px none">',
    '<td valign="top" align="center" style="border-collapse: collapse; border-spacing: 0px; border: 0px none">',
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="border-collapse: collapse; border-spacing: 0px; border: 0px none; margin: 0px; padding: 0px"><tbody><tr align="left" style="border-collapse: collapse; border-spacing: 0px; border: 0px none">',
    '<td width="100%">',
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0px; border: 0px none; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr align="left" style="border-collapse: collapse; border-spacing: 0px; border: 0px none">',
    '<td width="100%">',
    '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0px; border: 0px none; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr style="border-collapse: collapse; border-spacing: 0px; border: 0; height: 50px">',
    '<td width="100%" valign="top" height="50" align="left" style="background: #FFFFFF" bgcolor="#FFFFFF"><img width="1" height="50" style="border: 0; display: block; line-height: 1; opacity: 0; padding: 0px" src="cid:clear" alt=""></td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr></tbody></table>',
    '</div>',
    '<table align="center" cellpadding="0" cellspacing="0" width="100%" style="background: #FFFFFF; border-collapse: collapse; border-spacing: 0; border: 0; margin: 0px 0 0; padding: 0px 0 0" bgcolor="#FFFFFF"><tr align="center" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<div class="mi-all" style="display: block">',
    '<table class="mi-all" width="850" align="center" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; display: block; margin: 0px 0 0; padding: 0px 0 0"><tbody>',
    '<tr align="left" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850">',
    '<table width="850" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850" height="40" align="left" valign="top" style="">',
    '<img height="40" src="cid:img6" style="border: 0; display: block; height: 40px; line-height: 1; max-height: 40px; max-width: 850px; min-height: 40px; min-width: 850px; width: 850px" width="850">',
    '</td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr>',
    '<tr align="left" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850">',
    '<table width="850" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="21" height="42" align="left" valign="top" style="">',
    '<img height="42" src="cid:img8" style="border: 0; display: block; height: 42px; line-height: 1; max-height: 42px; max-width: 21px; min-height: 42px; min-width: 21px; width: 21px" width="21">',
    '</td>',
    '<td width="809" height="42" align="left" valign="top" style="">',
    '<img height="42" src="cid:img3" style="border: 0; display: block; height: 42px; line-height: 1; max-height: 42px; max-width: 809px; min-height: 42px; min-width: 809px; width: 809px" width="809">',
    '</td>',
    '<td width="20" height="42" align="left" valign="top" style="">',
    '<img height="42" src="cid:img1" style="border: 0; display: block; height: 42px; line-height: 1; max-height: 42px; max-width: 20px; min-height: 42px; min-width: 20px; width: 20px" width="20">',
    '</td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr>',
    '<tr align="left" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850">',
    '<table width="850" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="21" height="478" align="left" valign="top" style="">',
    '<img height="478" src="cid:img12" style="border: 0; display: block; height: 478px; line-height: 1; max-height: 478px; max-width: 21px; min-height: 478px; min-width: 21px; width: 21px" width="21">',
    '</td>',
    '<td width="36" height="478" align="left" valign="top" style="">',
    '<img height="478" src="cid:img9" style="border: 0; display: block; height: 478px; line-height: 1; max-height: 478px; max-width: 36px; min-height: 478px; min-width: 36px; width: 36px" width="36">',
    '</td>',
    '<td width="366" height="478" align="left" valign="top" style="">',
    '<div style="border: 0; display: block; height: 478px; line-height: 1; max-height: 478px; max-width: 366px; min-height: 478px; min-width: 366px; width: 366px">',
     '<p style="padding-top: 30px;padding-left:12px;padding-right: 12px;margin-top:0; margin-bottom: 0">',
     ,title, ',<br><br>Mereu ai crezut în mine. Dar mă uit in jurul meu si văd că viitorul pe care mi-l doresc eu nu are nicio șansă in România. Așa că m-am hotărât să plec în ', country.toLowerCase().replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); }) ,'.<br><br>O să-mi fie dor de tine, și ție de mine. Dar țara asta pare să fie prea coruptă ca eu să mai pot reuși să fac ceva pe meritul meu, fără pile și fără șpagă. Că nimeni nu pleacă de drag.<br>Să știi, totuși, că mai există un singur om care îmi dă speranță. Este o persoană care mi-a demonstrat că vrea ceea ce vreau și eu. De aceea te rog din suflet ca pe 2 noiembrie să crezi iar în mine și să votezi cu Monica Macovei. <br><br>Vă iubesc și ne vedem cât de curând!' ,
    '</p>',
    '</div>',
    '</td>',
    '<td width="407" height="478" align="left" valign="top" style="">',
    '<img height="478" src="cid:img5" style="border: 0; display: block; height: 478px; line-height: 1; max-height: 478px; max-width: 407px; min-height: 478px; min-width: 407px; width: 407px" width="407">',
    '</td>',
    '<td width="20" height="478" align="left" valign="top" style="">',
    '<img height="478" src="cid:img14" style="border: 0; display: block; height: 478px; line-height: 1; max-height: 478px; max-width: 20px; min-height: 478px; min-width: 20px; width: 20px" width="20">',
    '</td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr>',
    '<tr align="left" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850">',
    '<table width="850" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="57" height="32" align="left" valign="top" style="">',
    '<img height="32" src="cid:img7" style="border: 0; display: block; height: 32px; line-height: 1; max-height: 32px; max-width: 57px; min-height: 32px; min-width: 57px; width: 57px" width="57">',
    '</td>',
    '<td width="366" height="32" align="left" valign="top" style="">',
    '<img height="32" src="cid:img11" style="border: 0; display: block; height: 32px; line-height: 1; max-height: 32px; max-width: 366px; min-height: 32px; min-width: 366px; width: 366px" width="366">',
    '</td>',
    '<td width="407" height="32" align="left" valign="top" style="">',
    '<img height="32" src="cid:img4" style="border: 0; display: block; height: 32px; line-height: 1; max-height: 32px; max-width: 407px; min-height: 32px; min-width: 407px; width: 407px" width="407">',
    '</td>',
    '<td width="20" height="32" align="left" valign="top" style="">',
    '<img height="32" src="cid:img13" style="border: 0; display: block; height: 32px; line-height: 1; max-height: 32px; max-width: 20px; min-height: 32px; min-width: 20px; width: 20px" width="20">',
    '</td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr>',
    '<tr align="left" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850">',
    '<table width="850" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850" height="46" align="left" valign="top" style="">',
    '<img height="46" src="cid:img15" style="border: 0; display: block; height: 46px; line-height: 1; max-height: 46px; max-width: 850px; min-height: 46px; min-width: 850px; width: 850px" width="850">',
    '</td>',
    '</tr></tbody></table>',
    '</td>',
    '</tr>',
    '</tbody></table>',
    '</div>',
    '<div class="mi-all" style="display: block">',
    '<table class="mi-all" width="850" align="center" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; display: block; margin: 0px 0 0; padding: 0px 0 0"><tbody><tr align="left" style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '<td width="850">',
    '<table width="850" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse; border-spacing: 0; border: 0; margin-top: 0px !important; padding-top: 0px !important"><tbody><tr style="border-collapse: collapse; border-spacing: 0; border: 0">',
    '</tr></tbody></table>',
    '</td>',
    '</tr></tbody></table>',
    '</div>',
    '</td>',
    '</tr></table>'
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

  if (!emailRegxp.test(request.body.source)) {
    console.log('source email error');
    response.status(500).end();
    return;
  }

  letters.insert(
    {
      "ip": request.ip,
      "from:": request.body.source,
      "sendTo": request.body.sendTo,
      "destination": request.body.destination,
      "title": request.body.title
    }
  );

  sendgrid.send({
  to:       request.body.sendTo,
  from:     request.body.source,
  subject:  'M-am hotarat sa plec din tara.',
  files: [
    {
      cid: 'clear',
      path: 'images/clear.gif'
    },
    {
      cid: 'img1',
      path: 'images/image-085e4a7d50f3116ac905bdc69e5edb64470fcdb5.jpg'
    },
    {
      cid: 'img3',
      path: 'images/image-1fbbfec9671e6dceb1c9e7b5c57b8ac39ab5588c.jpg'
    },
    {
      cid: 'img4',
      path: 'images/image-22da4308cf8594962bc1d1efe2454fd6aa94df81.jpg'
    },
    {
      cid: 'img5',
      path: 'images/' + request.body.destination + '.jpg'
    },
    {
      cid: 'img6',
      path: 'images/image-370e1cdf72bbd1385ab2c40025d78fd911c07f7a.jpg'
    },
    {
      cid: 'img4',
      path: 'images/image-22da4308cf8594962bc1d1efe2454fd6aa94df81.jpg'
    },
    {
      cid: 'img7',
      path: 'images/image-5cddb3a8fc00dfbb3aef580900f99893f26b525d.jpg'
    },
    {
      cid: 'img8',
      path: 'images/image-6c203ccb897c7ac0d3689486bff25981192f1b9e.jpg'
    },
    {
      cid: 'img9',
      path: 'images/image-a4df89965283ce1c381898b8f87a4c23a9759a8b.jpg'
    },
    {
      cid: 'img11',
      path: 'images/image-c6b1af37716c107a3fdc3a52c94658dce5f7ff93.jpg'
    },
    {
      cid: 'img12',
      path: 'images/image-e136fac5cde17e423fb3725238e8161051556f8e.jpg'
    },
    {
      cid: 'img13',
      path: 'images/image-ec5141699d905b81073d6ab3265c61f1ae9ff0d8.jpg'
    },
    {
      cid: 'img14',
      path: 'images/image-ed92b24cbbd65ef76b731c72be0c433461342649.jpg'
    },
    {
      cid: 'img15',
      path: 'images/image-f62c5c71e6a815e188a25b074a1da8498cf0cc1b.jpg'
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
