var builder = require('botbuilder');
var restify = require('restify');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
 });
 
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASSWORD
});
 
server.post('/api/messages', connector.listen()); 

var bot = new builder.UniversalBot(connector, [
    function(session){
        session.beginDialog('greetings');
    }
]);

bot.dialog('greetings', [
    function(session){
        session.beginDialog('askName');
    },
    function(session){
        session.beginDialog('reservation');
    }
]);

bot.dialog('askName', [
    function(session){
        builder.Prompts.text(session, 'Bienvenue dans le bot Resa, comment tu t\'apelle ?');
    },
    function(session, results){
        session.endDialog('Bonjour %s!', results.response);
     }
]);

bot.dialog('reservation', [
    function (session) {
        session.beginDialog('telMe');
    },
    function (session, results) {
        session.send(`Voici votre réservation : <br/>
        Date reservation : ${results.reservationDate} <br/>
        Nombre de personne : ${results.numberPeople} <br/>
        Au nom de : ${results.reservationName}`);
    }
]);

bot.dialog('telMe', [
    function (session) {
        builder.Prompts.text(session, 'Pour quelle date souhaitez vous une reservation ?');
    },
    function (session, results) {
        session.dialogData.reservationDate = results.response;
        builder.Prompts.number(session, 'Pour combien de personne ?');
    },
    function (session, results) {
        session.dialogData.numberPeople = results.response;
        builder.Prompts.text(session, 'A quel nom ?');
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;
        var finalResults = {
            reservationDate: session.dialogData.reservationDate,
            numberPeople: session.dialogData.numberPeople,
            reservationName: session.dialogData.reservationName
        }
        session.endDialogWithResult(finalResults);
    }
]);