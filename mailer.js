var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILSEND||'',
    pass: process.env.MAILPASS||''
  }
});

var mailOptions = {
  from: process.env.MAILSEND||'',
  to: process.env.MAILRECIPIENT||'',
  //subject: 'Sending Email using Node.js',
  //text: 'That was easy!'
};

const sendMail=(subject, message)=>{
    mailOptions.subject = subject
    mailOptions.text = message+'/n/n https://ryanmontgomery.herokuapp.com'
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        }); 
}

module.exports=sendMail