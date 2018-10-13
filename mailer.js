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
};

const sendMail=(subject, message)=>{
    mailOptions.subject = subject
    mailOptions.text = message+'/n/n https://ryanwademontgomery.com'
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        }); 
}

module.exports=sendMail
