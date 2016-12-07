var helper = require('sendgrid').mail;
var from_email = new helper.Email('play@wikilinks.herokuapp.com');
var tracking_settings = new helper.TrackingSettings()
var open_tracking = new helper.OpenTracking(true)
tracking_settings.setOpenTracking(open_tracking)

function share(userName, friendName, email, startPage, endPage, gameLink, callback) {
	var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

	var request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: writeMail(userName, friendName, email, startPage, endPage, gameLink)
	});

	sg.API(request, function(error, response) {
		callback(response.statusCode == "202");
	});
}

function writeMail(userName, friendName, email, startPage, endPage, gameLink) {
	var to_email = new helper.Email(email);
	var subject = userName + " has invited you to play WikiLinks!";
	var content = new helper.Content('text/html', writeContent(userName, friendName, email, startPage, endPage, gameLink));
	var mail = new helper.Mail(from_email, subject, to_email, content);

  	mail.addTrackingSettings(tracking_settings)

	return mail.toJSON();
}

function writeContent(userName, friendName, email, startPage, endPage, gameLink) {
	return `<html>
			<body style="margin: 0">
				<div style="background-color: #6600ff;">
					<h1 style="color: #FFFFFF; margin: auto 0; display: inline-block; vertical-align: middle";>WikiLinks</h1>
				</div>
				
				<div style="margin: 0 10px;">
					<p>Hi ${friendName},</p>
					<p></p>
					<p>${userName} has invited to you try and get from the Wikipedia pages: ${startPage} to ${endPage}. You can play by clicking <a href="${gameLink}">here</a></p>
					<p>You can also copy this link into your browser window:</p>
					<a href="${gameLink}" style="margin: auto 0;">${gameLink}</a>
					<p></p>
					<p>Good Luck!</p>
					<p style="border-top: 1px solid black">Sent via <a href="http://wikilinks.herokuapp.com" style="color: rgb(0, 0, 179)">wikilinks.herokuapp.com</a></p>
				</div>
			</body>
			</html>`;
}

module.exports.share = share;