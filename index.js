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
            } catch (e) { console.log("errooo grave na reconexão") }
        }, 120000)
    }

});

/*
setInterval(async function() {
    if (!client.voice.connections.size) {
        console.log("desconectado")
        if (!channel) return;
        try {
            playInAllChannels(client)
        } catch (error) {
            console.error(error);
            channel.leave()
        }
    }
}, 500);*/

client.on('raw', async dados => {
    if (!dados.d) return
    if (!dados.d.user_id) return;
    if (dados.d.user_id !== '870349656595517521') return;
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
    }

    if (command === 'add') {

        args[0] = args[0].replace('<#', '')
        args[0] = args[0].replace('>', '')

        console.log(args[0])
        let channel = client.channels.cache.get(args[0]) || await client.channels.fetch(args[0]);
        if (!channel) {
            message.channel.send("canal não existe");
            return
        } else if (channel.type !== "voice") {
            message.channel.send("id não é de um canal de voz");
            return
        } else {

            immediateEntry(args[0], client)
            database.set(message.guild.id, args[0])
        }
    }

    if (command === 'remove') {

        try {

            let getChannel = database.get(`${message.guild.id}`)

            let channel = client.channels.cache.get(getChannel.channel) || await client.channels.fetch(getChannel.channel);
            channel.leave()
            database.delete(`${message.guild.id}`)

        } catch (error) {
            message.channel.send("Mande esse comando no chat do seu servidor")
        }
    }
    if (command === 'help') {
        message.channel.send('Olá, use >add id para adicionar o canal de voz e para o bot saber em qual Voice Channel ele ficará❤️ \n Exemplo: >add 12345678901234567 (você precisa ativar as opções de desenvolver e copiar o id do canal de voz) \n Mande um >remove caso queira remover o bot (ele não sairá da call até que este comando seja executado)🎧')
    }
});


client.login(token);