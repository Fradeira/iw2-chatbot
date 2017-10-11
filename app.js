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

bot.dialog('greetings',[
    function(session){
        session.beginDialog('askName');
    },
    function(session){
        session.beginDialog('reservation');
    }
]);

bot.dialog('askName',[
    function(session){
        builder.Prompts.text(session, 'Bienvenue dans le bot Resa, comment tu t\'apelle ?');
    },
    function(session, results){
        session.endDialog('Bonjour %s!', results.response);
     }
]);

bot.dialog('reservation',[
    function(session){
        builder.Prompts.text(session, 'Pour quelle date souhaitez vous reserver ?');
    },
    function(session){
        builder.Prompts.text(session, 'Pour combien de personne ?');
    },
    function(session){
        builder.Prompts.text(session, 'Au nom de qui ?');
    },
    function(session, results1){
        session.endDialog('Votre resa : %s!', BotBuilder.Data.SessionState);
    }
]);