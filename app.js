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
    // function(session){
    //     session.beginDialog('askName');
    // },
    // function(session){
    //     session.beginDialog('reservation');
    // }
    function(session){
        builder.Prompts.choice(session, "Bienvenue, que souhaitez-vous faire ? (tapez 1 ou 2)", "Demander mon nom|Reserver");
    },
    function (session, results) {
        if (results.response.index == 0) {
            session.beginDialog('askName');
        } else {
            session.beginDialog('reservation');
        }
    }
]);

bot.dialog('askName', [
    function(session){
        builder.Prompts.text(session, 'Comment tu t\'apelle ?');
    },
    function(session, results){
        session.endDialog('Bonjour %s!', results.response);
    },
]);

bot.dialog('reservation', [
    function (session) {
        session.beginDialog('telMe');
    },
    function (session, results) {
        session.send(`Voici votre reservation : <br/>
        Date reservation : ${results.reservationDate}<br/>
        Nombre de personne : ${results.numberPeople}<br/>
        Au nom de : ${results.reservationTel}<br/>
        Au telephone : ${results.reservationName}`);
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
        session.dialogData.resaTel = results.response;
        builder.Prompts.number(session, 'Quel est votre numero de telephone ?');
    },
    function (session, results) {
        session.dialogData.reservationName = results.response;
        var finalResults = {
            reservationDate: session.dialogData.reservationDate,
            numberPeople: session.dialogData.numberPeople,
            reservationTel: session.dialogData.resaTel,
            reservationName: session.dialogData.reservationName
        }
        session.endDialogWithResult(finalResults);
    }
]);