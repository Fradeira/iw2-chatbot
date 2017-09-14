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

    //New conversation > Ecrire un mot > New conversation > Done
    bot.on('conversationUpdate', function (message) {
        if (message.membersAdded && message.membersAdded.length > 0) {
            //Definit un nouveau membre 
            var membersAdded = message.membersAdded
                .map(function (m) {
                    var isSelf = m.id === message.address.bot.id;
                    return (isSelf ? message.address.bot.name : m.name) || '' + ' (Id: ' + m.id + ')';
                })
                .join(', ');
            
            //Si cest le nouveau membre est un user bim ecrit
            if (membersAdded == 'User') {
                bot.send(new builder.Message()
                    .address(message.address)
                    .text('Welcome bro !')
                );
            }
        }
    })

    if (session.message.text === "doheavywork") {
        //Effet "en train decrire"
        session.sendTyping();
        //Bim apres 3,7 secondes message
        setTimeout(()  => {
            session.send("Wait, i don't want work !!!");
        }, 3700);
    }
    
});

