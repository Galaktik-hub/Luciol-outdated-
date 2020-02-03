const Discord = require ('discord.js');
const ms = require("ms")
const moment = require("moment");
    moment.locale("fr");
const giveaways = require("discord-giveaways");
const ytdl = require("ytdl-core");
const cheerio = require("cheerio");
const request = require("request");
const bot = new Discord.Client();
const queue = new Map();
const YouTube = require("simple-youtube-api");
const { Util} = require('discord.js');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const client = new Discord.Client();

const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ histoires: [], xp: []}).write()

const token = 'NjMwMTMxMDYxNjU3MDQyOTQ1.XeGRSA.izMGS9CjqMEqe1ubJxF2Ck0dRrU';

const youtube = new YouTube("AIzaSyBBsW9okzru9y_s0322DcFlUK_DlO6QmN0")

const prefix = '??'

var servers = {};

var accueil = "🏰・accueil";

bot.on("ready", () => {

    console.log("Prêt à monter sur le toit du collège ?");

    bot.user.setPresence({
        game: {
            name: `${bot.guilds.size} serveurs | ??help`,
            type: "STREAMING",
            url: "https://www.twitch.tv/"
        }
    });
    
    giveaways.launch(bot, {
        updateCountdownEvery: 5000,
        botsCanWin: false,
        ignoreIfHasPermission: [],
        embedColor: "#FF0000",
        reaction: "🎉",
    });
    
});

//ajout de bot
bot.on('guildCreate', guild => {
    const embed = new Discord.RichEmbed()
        .setDescription(`📌 Merci à **${guild.name}** d'avoir ajouté 🔥Luciol🔥`)
        .addField("📋 __Nom du serveur__", guild.name, true)
        .addField("📊 __Nombre de membres__ :", guild.memberCount, true)
        .addField("💻 __Nombre de salons__ :", guild.channels.size, true)
        .addField("👤 __Propriétaire__ :", guild.owner, true)
        .addField("🌍 __Région du serveur__ :", guild.region, true)
        .addField("📝 __ID du serveur__ :", guild.id, true)
        .setColor("#F03A17")
    bot.channels.get('650086551845339189').send(embed);
});

bot.on('guildDelete', guild => {
    const embed = new Discord.RichEmbed()
        .setDescription(`📌 Malheureusement **${guild.name}** a retiré 🔥Luciol🔥`)
        .addField("📋 __Nom du serveur__", guild.name, true)
        .addField("📊 __Nombre de membres__ :", guild.memberCount, true)
        .addField("💻 __Nombre de salons__ :", guild.channels.size, true)
        .addField("👤 __Propriétaire__ :", guild.owner, true)
        .addField("🌍 __Région du serveur__ :", guild.region, true)
        .addField("📝 __ID du serveur__ :", guild.id, true)
        .setColor("#F03A17")
    bot.channels.get('650086551845339189').send(embed);
});

//membres
bot.on('guildMemberAdd', member =>{
    try {
        member.guild.channels.find("name",`${accueil}`).send("Bienvenue à toi, "+ member )
        var autorole = member.guild.roles.find("name","👥 | Membre")
        member.addRole(autorole)
    } catch (error) {
        console.log(error)
    }

    
})
bot.on('guildMemberRemove' , member =>{
    try {
        member.guild.channels.find("name",`${accueil}`).send("Malheureusement, "+ member +" nous a quitté")
    } catch (error) {
        console.log(error)
    }
})

bot.on('message' , async msg =>{

    let args = msg.content.split(" ").slice(1);
    const split = msg.content.split(" ").slice(1).join(" ");
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;

    //help
    if(msg.content.startsWith(prefix+ "help")){
        const embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setFooter(`${msg.guild.name}, Version 1.0.4`)
            .setThumbnail(msg.guild.iconURL)
            .setTitle("Voici les différentes commandes:")
            .addField("⚠ **● Punitions:** ","`ban`,`kick`,`mute`,`unmute`")
            .addField("🕵 **● Administration:** ","`clear`,`fairesondage`,`giveaway`")
            .addField("📻 **● Musique:**","`musique`,`play`,`stop`,`skip`,`pause`,`resume`,`queue`,`np`")           
            .addField("🤡 **● Fun:** ","`roll`,`annonce`,`image`,`devin`,`xp`")
            .addField("📡 **● Info:**","`info-bot`,`info-serveur`,`info-user`,`nouveautés`,`ping`")
            .addField("⚒ **● Divers:**","`invite`,`accueil`,`autorole`")
            .addField("🔗 **● Liens:**","[__**[Invite Bot](https://discordapp.com/oauth2/authorize?client_id=630131061657042945&scope=bot&permissions=8)**__] - [__**[Serveur Support](https://discord.gg/https://discord.gg/QN8xGCZ)**__]")
        msg.channel.send(embed)
    }
    //accueil
    if(msg.content.startsWith(prefix+ "accueil")) {
        if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("Il te manque la permission >> `ADMINISTRATOR`");
        if(msg.guild.channels === accueil) return msg.channel.send("La fonction `d'accueil` est déjà activée sur votre serveur")
        msg.channel.send("Vous venez d'activez `l'accueil`, toutes les personnes rejoignant et quittant le serveur seront chaleuresement accueilli ou un aurevoir digne de ce nom !")
        msg.guild.createChannel("🏰・accueil","text").then(channel => {
            channel.setTopic("Ici, vous verez qui quitte et qui rejoins votre serveur !")
        })
    }
    //autorole
    if(msg.content.startsWith(prefix + "autorole")) {
            if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("Il te manque la permission >> `ADMINISTRATOR`");
            const embed = new Discord.RichEmbed()
            .setTitle("__**Vous venez d'activez la fonction **__`autorole`")
            .setColor('RANDOM')
            .addField("Grâce à elle, chaque membre qui rejoint ce serveur aura automatiquement le rôle:","👥 | Membre")
            .addField("__Pour la désactiver:__","Il suffit juste de supprimer le rôle 👥 | Membre")
        msg.channel.send(embed)
        var membre = msg.guild.roles.find("name", "👥 | Membre")
        if(!membre){
            try{
                membre = msg.guild.createRole({
                name: "👥 | Membre",
                color: "#1059ec",
                permissions:[]
              })
    }catch (err){
        console.log(err)
    }}
    }
    //info-bot
    if(msg.content.startsWith(prefix + "info-bot")){
        const embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setFooter("Version 1.0.4")
        .setTitle("__**Informations concernant le bot:**__")
        .addField("🕵__Créateur:__","Galaktik \:milky_way:#6508", true)
        .addField("🤖__Utilisateurs:__", bot.users.size, true)
        .addField("📜__Channels:__", bot.channels.size,true)
        .addField("⚙__Nombres de serveurs:__", bot.guilds.size, true)
        .addField("📁__Date de création:__", moment(bot.user.createdAt).format("LL"), true)
        .addField("🔗 **● Liens:**","[__**[Invite Bot](https://discordapp.com/oauth2/authorize?client_id=630131061657042945&scope=bot&permissions=8)**__] - [__**[Serveur Support](https://discord.gg/https://discord.gg/QN8xGCZ)**__]")
        .setThumbnail(msg.guild.iconURL)
    msg.channel.send(embed)
    }
    //info-user
    if(msg.content.startsWith(prefix + "info-user")) {
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setFooter("Version 1.0.4")
        .setTitle(`__**Informations concernant ${msg.author.username}:**__`)
        .addField("🤖 ● __Nom d'utilisateur:__",`${msg.author.tag}`, true)
        .addField("🔐 ● __Status:__",`${msg.author.presence.game}`, true)
        .addField("📰 ● __ID:__",`${msg.author.id}`, true)
        .addField("👀 ● __Tu es:__",`${msg.author.presence.status}`, true)
        .addField("📁 ● __Date de création du compte:__", moment(msg.author.createdAt).format("LL"), true)
        .setThumbnail(msg.author.avatarURL)
    msg.channel.send(embed)
    }
    //ping
    if(msg.content.startsWith(prefix + "ping")) {
        const embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField("📌 ● **Ping:**",`${new Date().getTime() - msg.createdTimestamp + "ms"}`)
    msg.channel.send(embed)
    }
    //nouveautés
    if(msg.content.startsWith(prefix + "nouveautés")){
        const embed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setFooter("Version 1.0.4")
        .setTitle("__**Qu'est ce qu'il y'a de nouveau ?**__")
        .addField("Hey hey :wave: \n \n Il y a du nouveau qui est arrivé, Tous les embed ont été améliorés visuellement \n  Le système d'XP est arrivé \n Le bot est maintenant sur le site officiel https://top.gg/ \n Le info-user est là !","Alors... Qu'attendez-vous pour les essayer ? :wink:",)
        msg.channel.send(embed)
    }
    //invite
    if(msg.content.startsWith(prefix + "invite")){
        const embed = new Discord.RichEmbed()
            .setDescription("📡__**On dirait que quelqu'un veut m'ajouter:**__")
            .addField("Voici deux liens qui t'enverront sur une page pour m'ajouter sur ton serveur et pour aller sur le serveur support :wink:","[__**[Ajoute le bot](https://discordapp.com/oauth2/authorize?client_id=630131061657042945&scope=bot&permissions=8)**__] - [__**[Serveur Support](https://discord.gg/QN8xGCZ)**__]")
        msg.channel.send(embed)
    }
    //roll
    if(msg.content.startsWith(prefix+ "roll")){ 
        
        let aleatoire = Math.floor(Math.random() * (101 - 1) + 1)
        const embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle("🎲 Les dès ont été lancés et tu as obtenu:")
            .setDescription(aleatoire)
        msg.channel.send(embed)
    }
    //clear
    if(msg.content.startsWith(prefix+ "clear")){
        if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Il te manque la permission >> `MANAGE_MESSAGES`");
        msg.channel.bulkDelete(args[0]).then(() => {
        msg.channel.send("J'ai supprimé " + args[0] + " messages").then(r => r.delete(5000))
        })
    }
    //sondage
    if(msg.content.startsWith(prefix+ "fairesondage")) {
        if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Il te manque la permission >> `MANAGE_MESSAGES`");
        const embed = new Discord.RichEmbed()
        .setTitle("__**Comment faire un sondage ?:**__")
        .addField("`sondage1`","Cette commande vous permettra de mettre d'accord la communauté sur un choix avec ✅ et  ❌ !")
        .addField("`sondage2`","Cette commande vous permettra de choisir entre deux choses avec ◀️ et ▶️ !")
        .setColor('RANDOM')
        .setFooter("La meilleure des choses, c'est de tester par soi-même 😉")
        msg.channel.send(embed)
    }
    //sondage 1
    if(msg.content.startsWith(prefix+ "sondage1")){ msg.delete()
        if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Il te manque la permission >> `MANAGE_MESSAGES`");
        if(!args[0]) return msg.channel.send("Met un sondage !");
        const embed = new Discord.RichEmbed()
            .setDescription(`:bar_chart: Sondage de ${msg.author.username}: `)
            .addField(split , "Repondre avec :white_check_mark:  ou :x: |")
            .setColor('RANDOM')
        msg.channel.send(embed).then(function (msg) {
            msg.react("✅")
            msg.react("❌")
        })
        
    }
    //sondage 2
    if(msg.content.startsWith(prefix+ "sondage2")){ msg.delete()
        if(!msg.member.hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Il te manque la permission >> `MANAGE_MESSAGES`");
        if(!args[0]) return msg.channel.send("Met un sondage !");
        const embed = new Discord.RichEmbed()
            .setDescription(`:bar_chart: Sondage de ${msg.author.username}: `)
            .addField(split , "Repondre avec :arrow_backward: ou :arrow_forward:")
            .setColor('RANDOM')
            .setTimestamp()
        msg.channel.send(embed).then(function (msg) {
            msg.react("◀")
            msg.react("▶")
        })
    }
    //ban
    if(msg.content.startsWith(prefix+ "ban")){
        if(!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send("Il te manque la permission >> `BAN_MEMBERS`");
        if(!args[0]) return msg.channel.send("Qui dois-je bannir ?");
        const user = msg.mentions.users.first();
        if(user){
            const member = msg.guild.member(user);
            if(member){
                member.ban({
                    reason: args.slice(2).join(" ")
                }).then(() => {
                    msg.channel.send(`✅ ${member} a bien été banni ! https://tenor.com/view/when-your-team-too-good-ban-salt-bae-gif-7580925`)
                    member.send("Tu as été banni de " + msg.guild.name)
                }).catch(err => {
                    msg.channel.send("Erreur, cette personne ne peut pas être banni !")
                })
            }else{
                msg.channel.send("Cette personne n'existe pas !");
            }
        }else{
            msg.channel.send("Qui dois-je bannir ?");
        }
    }
    //trollban
    if(msg.content.startsWith(prefix+ "trollban")){
        if(!msg.member.hasPermission("BAN_MEMBERS")) return msg.channel.send("Il te manque la permission >> `BAN_MEMBERS`");
        if(!args[0]) return msg.channel.send("Qui dois-je bannir ?");
        const user = msg.mentions.users.first();
        if(user){
            const member = msg.guild.member(user);
            if(member){
                member.ban({
                    reason: args.slice(2).join(" ")
                }).then(() => {
                    msg.channel.send(`✅ ${member} a bien été banni ! https://tenor.com/view/when-your-team-too-good-ban-salt-bae-gif-7580925`)
                    
                }).catch(err => {
                    msg.channel.send("Erreur, cette personne ne peut pas être banni !")
                })
            }else{
                msg.channel.send("Cette personne n'existe pas !");
            }
        }else{
            msg.channel.send("Qui dois-je bannir ?");
        }
    }
    //kick
    if(msg.content.startsWith(prefix+ "kick")){
        if(!msg.member.hasPermission("KICK_MEMBERS")) return msg.channel.send("Il te manque la permission >> `KICK_MEMBERS`");
        if(!args[0]) return msg.channel.send("Qui dois-je kick ?");
        const user = msg.mentions.users.first();
        if(user){
            const member = msg.guild.member(user);
            if(member){
                member.kick({
                    reason: args.slice(2).join(" ")
                }).then(() => {
                    msg.channel.send(`✅ ${member} a bien été kick ! https://tenor.com/view/punt-kick-baby-grandma-gif-8217719`)
                }).catch(err => {
                    msg.channel.send("Erreur, cette personne ne peut pas être kick !")
                })
            }else{
                msg.channel.send("Cette personne n'existe pas !");
            }
        }else{
            msg.channel.send("Qui dois-je kick ?");
        }
    }
    //mute
    if(msg.content.startsWith(prefix + "mute")){
        if(!msg.guild.member(msg.author).hasPermission("MUTE_MEMBERS")) return msg.channel.send("Il te manque la permission >> `MUTE_MEMBERS`");
        let member = msg.mentions.members.first();
        var mute_msg = msg.content.split(' ').slice(2);
        if(!member) return msg.channel.send("Il faut me donner une personne à mute !")
        let muterole = msg.guild.roles.find(`name`, "🔇 | Mute");
        if(!muterole){
          try{
            muterole = msg.guild.createRole({
              name: "🔇 | Mute",
              color: "#000000",
              permissions:[]
            })
          }catch(e){
              console.log(e)
          }
        }
        try{
          msg.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        }catch(e){
          console.log(e)
        }
        try{
          member.addRole(muterole.id)
            msg.channel.send(`${member} a été réduit au silence !`)
          
        }catch(e){return;}
      }
    //unmute
    if(msg.content.startsWith(prefix+ "unmute")){
        if(!msg.guild.member(msg.author).hasPermission("MUTE_MEMBERS")) return msg.channel.send("Il te manque la permission >> `MUTE_MEMBERS`");
        let member = msg.mentions.members.first();
        if(!member) return msg.channel.send("Il faut me donner une personne à unmute !")
        let muterole = msg.guild.roles.find(`name`, "[🔇] mute");
        try {
            member.removeRole(muterole.id)
            msg.channel.send(`${member} peut à nouveau parler !`)
        } catch (err) {
            msg.channel.send("Erreur")
        }
    }
    //annonce
    if(msg.content.startsWith(prefix+ "annonce")) { msg.delete()
        if(!msg.guild.member(msg.author).hasPermission("MANAGE_MESSAGES")) return msg.channel.send("Il te manque la permission >> `MANAGE_MESSAGES`")
        if(!args[0]) return msg.channel.send("Met une annonce !");
        const embed = new Discord.RichEmbed()
            .setTitle(` 📢__**Annonce de ${msg.author.username}:**__ `)
            .setColor('RANDOM')
            .setTimestamp()
            .setDescription(split)
            .setThumbnail(msg.guild.iconURL)
        msg.channel.send(embed)
    }
    //info serveur
    if(msg.content.startsWith(prefix+ "info-serveur")){
        const embed = new Discord.RichEmbed()
        .setTitle("__**Informations " + msg.guild.name +":**__")
        .setColor('RANDOM')
        .addField("🕵 • __Propriétaire:__", msg.guild.owner, true)
        .addField("🌎 • __Région:__", msg.guild.region, true)
        .addField("🤖 • __Membres:__", msg.guild.members.size, true)
        .addField("📄 • __ID:__", msg.guild.id, true)
        .addField("📜 • __Channels:__", msg.guild.channels.size,true)
        .addField("⚙ • __Nombres de rôles:__", msg.guild.roles.size, true)
        .addField("😋 • __Nombres d'émojis:__", msg.guild.emojis.size, true )
        .addField("📁 • __Date de création:__", moment(msg.guild.createdTimestamp).format("LL"), true)
        .setThumbnail(msg.guild.iconURL)
        msg.channel.send(embed)
    }
    //commencez giveaway
    if(msg.content.startsWith(prefix + "start-giveaway")){
        if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("Il te manque la permission >> `ADMINISTRATOR`");
        giveaways.start(msg.channel, {
            time: ms(args[0]),
            prize: args.slice(2).join(" "),
            winnersCount: parseInt(args[1]),
            messages: {
                giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
                giveawayEnded: "🎉🎉 **GIVEAWAY TERMINÉ** 🎉🎉",
                timeRemaining: "Temps restant: **{duration}**!",
                inviteToParticipate: "Réagissez avec 🎉 pour participer!",
                winMessage: "Félicitations, {winners}! Tu as gagné **{prize}**!",
                embedFooter: "Giveaways",
                noWinner: "Giveaway annulé.",
                winners: "Gagnant(s)",
                endedAt: "Se termine dans:",
                units: {
                    seconds: "secondes",
                    minutes: "minutes",
                    hours: "heures",
                    days: "jours"
                }
            }
        });
    }
    //giveway reroll
    if(msg.content.startsWith(prefix + "re-giveaway")){
        if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("Il te manque la permission >> `ADMINISTRATOR`");
        let messageID = args[0];
            giveaways.reroll(messageID).then(() => {
                message.channel.send("Giveaway relancé avec succès");
            }).catch((err) => {
                message.channel.send("Aucun giveaway trouvé pour "+messageID+", veuillez rééssayer");
            });
        }
    //giveaway annulation
    if(msg.content.startsWith(prefix + "stop-giveaway")){
        if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("Il te manque la permission >> `ADMINISTRATOR`");
        let messageID = args[0];
        giveaways.delete(messageID).then(() => {
            message.channel.send("Giveaway supprimé avec succès !");
        }).catch((err) => {
            message.channel.send("Aucun giveaway trouvé pour "+messageID+", veuillez rééssayer");
        });
    }
    //giveaway
    if(msg.content.startsWith(prefix + "giveaway")){
        if(!msg.guild.member(msg.author).hasPermission("ADMINISTRATOR")) return msg.channel.send("Il te manque la permission >> `ADMINISTRATOR`");
        const embed = new Discord.RichEmbed()
        .setTitle("__**Comment créer un giveaway ?:**__")
        .setColor('RANDOM')
        .addField("`start-giveaway` pour commencer un giveway suivi: ","du temps, [Insérez un nombre] avec 's' pour secondes, 'm' pour minutes, 'h' pour heures et 'd' pour jours, \n du nombre de gagnants, \n et pour finir du sujet")
        .addField("`stop-giveaway` pour annuler un giveaway suivi: "," de l'ID du message du giveaway")
        .addField("`re-giveaway` pour re-avoir un nouveau gagant suivi: "," de l'ID du message du giveaway")
        msg.channel.send(embed)
    }
    //image
    if(msg.content.startsWith(prefix + "image")){
        image(msg)
    }
    //no image
    if(msg.content === "??image" ){
        msg.channel.send(":x: Tu ne m'as pas demandé quelle image je dois chercher !")
    }
    //devin
    if(msg.content.startsWith(prefix + "devin")) {
        if(!args[1]) return msg.channel.send("Tu ne m'as pas demandé ce que je devais deviner :crystal_ball:")
        var reponse = [
        "🔮 - **C'est sûr !**",
        "🔮 - **Demande à quelqu'un d'autre :unamused:**",
        "🔮 - **Tu me dérange là...**",
        "🔮 - **Oh que non !**",
        "🔮 - **Oh que oui !**",
        "🔮 - **Oh que non !**",
        "🔮 - **Oh que oui !**",
        "🔮 - **Sûrement pas !**",
        "🔮 - **Probablement :thinking:**",
        "🔮 - **Je sais pas va demander à Jean-Pierre ou à mon esclave**",
        "🔮 - **Je ne réponds pas aux moches**",
        "🔮 - **Ça dépend si la réponse à l’équation de la somme entre l’hypoténuse correspond au sens anti horaire de la réponse à la question 4 au BAC de maths en 2009** https://tenor.com/view/math-thinking-gif-7715569",
        "🔮 - **C'est la mer... la mer noire** https://tenor.com/view/mer-noire-cest-la-mer-noire-gif-12913157",
        "🔮 - **Désolé, je joue à Fortnite repasse plus tard ** https://tenor.com/view/dance-fortnite-cool-gif-12537704"
        ];
        let alea = (reponse[Math.floor(Math.random() * reponse.length)])
        msg.channel.send(`${alea}`)
    }
    //Easter Egg
    if(msg.content === "Salope"){
        msg.channel.send('GANG !' + ' https://tenor.com/view/young-thug-gesture-gestures-fingers-swag-gif-5349648')
    }
    if(msg.content.startsWith(prefix + "email")){
        const embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setFooter("Salope Gang, best gang ever")
            .setThumbnail(msg.guild.iconURL)
            .addField("📝__E-mail:__","salopegang7@gmail.com")
            .addField("🔐__Mot de passe:__","connard07")
        msg.channel.send(embed)
    }
    if(msg.content === "Créateur"){
        msg.channel.send("Ce bot a été créé par ǤȺłȺꝁŧɨꝁ 🌌#6508 avec l'aide de Skanix#4878")
    }
    if(msg.content === "Noweur") {
        msg.channel.send("le plus moche")
    }
    if(msg.content === "Flora") {
        msg.channel.send("Flora = Cendrillon = Pas ouf = Elle sert à rien")
    }
})

bot.on('message', async msg => {
    //musique
    if(msg.content.startsWith(prefix + "musique")) {
        const embed = new Discord.RichEmbed()
        .setTitle('__**Comment faire jouer de la musique au bot**__')
        .setColor("RANDOM")
        .addField("`play`","Pour jouer votre musique, il vous suffit de mettre une URL derrière ou bien de simplement chercher votre musique avec son titre.")
        .addField("`stop`","Pour arrêter la musique en cours et faire quitter le bot du channel.")
        .addField("`skip`","Pour sauter la musique en cours et aller à la suivante.")
        .addField("`volume`","Pour définir le volume de la musique, il est initialement à 5/5, et, un petit conseil pour vos oreilles, n'allez pas au-delà de cette limite 🙃")
        .addField("`pause`","Pour mettre en pause votre musique.")
        .addField("`resume`","Pour continuer la musique")
        .addField("`queue`","Pour voir quelles musiques vont suivre celle en cours.")
        .addField("`np`","Pour savoir le titre de la musique en cours.")
    msg.channel.send(embed)
    }
    //play
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(prefix)) return undefined;
    if(msg.channel.type === "dm") return;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)

	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('Tu dois être dans un channel pour que je puisse jouer de la musique !');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send("Je n'ai pas pu me connecter dans ton channel, assure toi que j'ai les permissions !");
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send("Je ne peux pas parler dans ton channel, assure toi que j'ai les permissions !");
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ Playlist: **${playlist.title}** a été ajouté à la queue !`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
                    let index = 0;
                    const embed = new Discord.RichEmbed ()
                    .setColor('RANDOM')
                    .setTitle("__**🔊 Sélection de la musique**__")
                    .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`)
                    .addField("📡 Voici les résultats que j'ai pu obtenir pour votre recherche !",`Veuillez m'indiquer la chanson que je dois jouer de 1-10`)
					msg.channel.send(embed);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 15000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send(":x: Tu m'as donné un mauvais numéro ou tu ne m'en as pas donné, j'annule la séléction !");
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send("🆘 Je n'ai pu obtenir de résultat pour cette recherche.");
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send("Tu n'est pas dans un channel !");
		if (!serverQueue) return msg.channel.send("Il n'y a rien que j'ai pu passer !");
		serverQueue.connection.dispatcher.end("La chanson a bien été passé ! ▶");
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send("Tu n'est pas dans un channel !");
		if (!serverQueue) return msg.channel.send("Il n'y a rien que j'ai pu arrêter pour toi !");
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end("La chanson a bien été arrêté ! ⏹");
		return undefined;
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send("Tu n'es pas dans un channel !");
		if (!serverQueue) return msg.channel.send("Il n'y a aucune musique en cours !");
        if (!args[1]) return msg.channel.send(`Le volume est actuellement de: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`J'ai mis le volume à **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send("Il n'y a aucune musique en cours !");
		return msg.channel.send(`🎶 En train de jouer: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send("Il n'y a aucune musique en cours");
		return msg.channel.send(`
__**Musique en attente:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**En train de jouer:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send("⏸ Je t'ai mis en pause la musique");
		}
		return msg.channel.send("Il n'y a aucune musique en cours");
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send("▶ Je t'ai remis la musique");
		}
		return msg.channel.send("Il n'y a aucune musique en cours !");
	}

	return undefined;
});

bot.on('message', message => {
    var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find("xp").value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp)
        console.log(`Nombre d'exp: ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();
        
    if(message.content.startsWith(prefix + "xp")){
        var xp = db.get("xp").filter({user: msgauthor}).find("xp").value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .setTitle(`Statistiques des XP de ${message.author.username}`)
            .setColor("RANDOM")
            .setDescription("Bravo petit spammeur :clap:")
            .addField("XP: ", `${xpfinal[1]} xp`)
            .setFooter("Ton expérience augmentera au fur et à mesure que tu envoie des messages 🗨️")
        message.channel.send(xp_embed);
    }}
})

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`Je n'ai pas pu rejoindre le channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`Je n'ai pas pu rejoindre le channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** a été mis en attente !`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Je commence à jouer: **${song.title}**`);
}

function image(msg){

    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + msg.content.split(" ").slice(1).join(" "),
        method: "GET",
        headers: {
            "Accept": "text/html",
            "User-Agent": "Chrome"
        }}


request(options, function(error, response, responseBody) {
    if (error) {
        return;
    }


    $ = cheerio.load(responseBody);


    var links = $(".image a.link");

    var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

    if (!urls.length) {
       
        return;
    }

    // Send result
    msg.channel.send( urls[Math.floor(Math.random() * urls.length)]);
})};

bot.login(token);
