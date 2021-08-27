import 'dotenv/config'
const { url, prefix, token } = process.env
    //if (token !== 'production')
    ////   dotenv.config();
import Discord from "discord.js"
import ytdl from "ytdl-core"
import db from 'quick.db'
import { playInAllChannels } from './src/playMethods/playInAllChannels.js'
import { immediateEntry } from './src/playMethods/immediateEntry.js'

const database = new db.table('database');

const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USERS', 'GUILD_MEMBER']

});
let interval = null;

if (!token) {
    console.error("token invalido");
} else
if (!ytdl.validateURL(url)) {
    console.log("link do vídeo inválido.");
}

client.on('ready', async() => {

    let status = [
        `❤️Rafaella Ballerini on Youtube!❤️`,
        `💜Rafaella Ballerini on Twitch!💜`,
        `🧡Rafaella Ballerini on Instagram!🧡`,
        `🎧Coding with Lo-fi!🎧`,
        `⭐Stream Lo-fi!⭐`,
        `👨‍💻Contact TAUZ#0001 for questions about me😺`
    ];
    let i = 0;

    setInterval(() => client.user.setActivity(`${status[i++ %
    status.length]}`, {
        type: 'WATCHING'
    }), 5000);
    playInAllChannels(client)
    console.log("BOT ON")

    if (!interval) {
        interval = setInterval(async function() {
            try {
                const database = new db.table('database')
                let getChannels = database.all()

                for (let i = 0; i < getChannels.length; i++) {
                    const channel = client.channels.cache.get(getChannels[i].data) || await client.channels.fetch(getChannels[i].data);
                    channel.leave()
                }
                playInAllChannels(client)
            } catch (e) { console.log("errooo grave na reconexão geral") }
            console.log("reconexão geral feita com sucesso!")
        }, 120000)
    }

});
/*
let tempDelay = 0;
setInterval(async function() {
    console.log(tempDelay)
    if (client.voice.connections.size < tempDelay) {
        console.log("desconectado")
        if (!channel) return;
        try {
            playInAllChannels(client)
        } catch (error) {
            console.error(error);
            channel.leave()
        }
    }
    tempDelay = client.voice.connections.size
}, 1500);
*/
client.on('raw', async dados => {
    if (!dados.d) return
    if (!dados.d.user_id) return;
    if (dados.d.user_id !== client.user.id) return;
    if (dados.t !== 'VOICE_STATE_UPDATE') return;

    if (dados.d.channel_id === null) {
        immediateEntry(dados.d.channel_id, client)
        return
    }
});

process.on("unhandledRejection", (reason, promise) => {
    try {
        console.error("Unhandled Rejection at: ", promise, "reason: ", reason.stack || reason);
    } catch {
        console.error(reason);
    }
});
process.setMaxListeners(0)


client.on("message", async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();


    if (message.author.id === '454059471765766156' || message.author.id === '760275647016206347') {
        if (command === "backup") {

            let embed = new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(`${message.author.tag} Aqui está o backup senhor: ☑️`)

            message.reply(embed)
            message.reply({ files: ['./json.sqlite'] })

        }
        if (command === 'relatorio') {



            const getDatabase = database.all()
            let channelsAddSucess = []

            for (let i = 0; i < getDatabase.length; i++) {
                let objChannel = getDatabase[i].data
                objChannel = objChannel.replace(/"/g, '')

                try {
                    const channel = await client.channels.fetch(objChannel);
                    if (channel) {
                        channelsAddSucess.push(channel)
                    }
                } catch (e) {}
            }
            let namesGuild = [],
                namesChannels = []
            channelsAddSucess.map(channel => {
                namesChannels.push(channel.name + '-' + channel.id)
                namesGuild.push(channel.guild.name + '-' + channel.guild.id)
            })

            let embed = new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle('Aqui está o Relatório:')
                .setDescription(`
                **Guilds:**
                \n${namesGuild.join('\n')}
                \n**Nos canais:**
                \n${namesChannels.join('\n')}`)
            message.channel.send(embed)
            return
        }
    }
    if (command === 'help') {
        message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setTitle(`${message.author.tag} Olá, eu sou a CODEFI do servidor BALLERINI e desde já agradeço ter me adicionado`)
            .setDescription('Para adicionar o bot a um canal digite `>add #!canal` ou `>add <id_Do_Canal>`😉' +
                '\nO bot foi criado sem fins lucrativos por isso é totalmente público e pode ser encontrado no servidor Ballerini' +
                '\nCriador inicial e futuras dúvidas: TAUZ#0001 (Moderador e Desenvolvedor no Servidor)')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        );
    }


    if (!message.member.hasPermission('ADMINISTRATOR')) {
        return message.channel.send(message.author, new Discord.MessageEmbed()
            .setColor('#ff8997')
            .setTitle(`${message.author.tag} Hey, voce não tem permissão para adicionar ou remover o bot, peça a um administrador fazer isso!🙅‍♀️`)
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true })));;
    }

    if (command === 'add') {

        args[0] = args[0].replace('<#', '')
        args[0] = args[0].replace('>', '')

        console.log(args[0])
        let channel = client.channels.cache.get(args[0]) || await client.channels.fetch(args[0]);
        if (!channel) {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle(`${message.author.tag} Hey, esse canal não existe!🙅‍♀️`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true })));
            return
        } else if (channel.type !== "voice") {
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle(`${message.author.tag} Hey, esse canal não é de voz!🙅‍♀️`)
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true })));
            return
        } else {

            immediateEntry(args[0], client)
            database.set(message.guild.id, args[0])
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle(`${message.author.tag} Uau, seu canal foi adicionado no nosso banco e o bot irá entrar`)
                .setDescription('Ficamos felizes por você estar testando nosso bot **CODEFI 24/7!**' +
                    '\n Compartilhe para mais servidores para que possamos levar essa doce melodia para mais pessoas que ainda não conhecem!' +
                    '\n**Diretamente do servidor Ballerini, o nosso muito obrigado!**')
                .setURL('https://discord.gg/ballerini')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            );
        }
    }

    if (command === 'remove') {

        try {
            let getChannel = database.get(`${message.guild.id}`)

            let channel = client.channels.cache.get(getChannel) || await client.channels.fetch(getChannel);
            if (channel) {
                channel.leave()
                database.set(`${message.guild.id}`, 'null')
            }

            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle(`${message.author.tag} O bot foi removido, estou aguardando o chat para que eu possa entrar😘`)
                .setDescription('Para adicionar o bot a um canal digite `>add #!canal` ou `>add <id_Do_Canal>`😉')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            );

        } catch (error) {
            console.log(error)
            message.channel.send(message.author, new Discord.MessageEmbed()
                .setColor('#ff8997')
                .setTitle(`${message.author.tag} Hey, Mande esse comando no seu servidor`)
                .setDescription('Para adicionar o bot a um canal digite `>add #!canal` ou `>add <id_Do_Canal>`😉')
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            );
        }
    }

});


client.login(token);