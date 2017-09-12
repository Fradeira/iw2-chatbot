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

var bot = new builder.UniversalBot(connector, function (session) {

    // bot.on('typing', function(){
    //     session.send(`haha, t'es en train d'ecrire :)`);
    // }) 

    if (session.message.text === "doheavywork") {
        //Effet "en train decrire"
        session.sendTyping();
        //Bim apres 3,7 secondes message
        setTimeout(()  => {
            session.send("Wait, i don't want work !!!");
        }, 3700);
    }

    
    
});

