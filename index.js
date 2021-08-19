import 'dotenv/config'
const { url, prefix, token } = process.env
    //if (token !== 'production')
    ////   dotenv.config();
import Discord from "discord.js"
import ytdl from "ytdl-core"
import db from 'quick.db'
import { playInAllChannels } from './src/playMethods/playInAllChannels.js'
import { setGuildsAndChannelsDatabase } from './src/databaseMethods/setGuildsAndChannelsDatabase.js'
import { immediateEntry } from './src/playMethods/immediateEntry.js'

const database = new db.table('database');

const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USERS', 'GUILD_MEMBER']

});
let broadcast = null,
    stream = ytdl(url, { highWaterMark: 100 << 150 }),
    pausaReload = false;

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

    await playInAllChannels(stream, broadcast, client)

});

setInterval(async function() {
    await playInAllChannels(stream, broadcast, client);
}, 60000)


client.on('raw', async dados => {
    if (!dados.d) return
    if (!dados.d.user_id) return;
    if (dados.d.user_id !== '870349656595517521') return;
    if (dados.t !== 'VOICE_STATE_UPDATE') return;
    if (dados.d.channel_id === null) {

        await immediateEntry(dados.d.guild_id, stream, broadcast, client)

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
    //lient.on('debug', console.log);

client.on("message", async message => {
    console.log(message.author)
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim();
    const commandWithPhrase = args.toLowerCase();
    const [command, idchannellocal] = commandWithPhrase.split(' ');

    let idguild;
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
        if (!idchannellocal || !Number(idchannellocal)) {
            message.channel.send("o id não é de um canal de voz, por favor verifique e adicione com *>add id**\nPor exemplo: >add 12345678901234567 ")
        } else {
            let channel = client.channels.cache.get(idchannellocal) || await client.channels.fetch(idchannellocal);
            if (!channel) {
                message.channel.send("canal não existe");

            } else if (channel.type !== "voice") {
                message.channel.send("id não é de um canal de voz");

            } else {
                setGuildsAndChannelsDatabase(message.guild.id, idchannellocal)
                immediateEntry(message.guild.id, stream, broadcast, client)
            }
        }
    }

    if (command === 'remove') {

        try {
            idguild = message.guild.id;
            let getGuilds = database.get('idGuilds'),
                getChannels = database.get('idChannels')
            for (let i = 0; i < getChannels.length; i++) {

                if (getGuilds[i] === idguild) {
                    let idchannel = client.channels.cache.get(getChannels[i]) || await client.channels.fetch(getChannels[i]);
                    idchannel.leave()
                    database.delete(`idGuilds.${i}`)
                    database.delete(`idChannels.${i}`)
                }
            }
        } catch (error) {
            message.channel.send("Mande esse comando no chat do seu servidor")
        }
    }
    if (command === 'help') {
        message.channel.send('Olá, use >add id para adicionar o canal de voz e para o bot saber em qual Voice Channel ele ficará❤️ \n Exemplo: >add 12345678901234567 (você precisa ativar as opções de desenvolver e copiar o id do canal de voz) \n Mande um >remove caso queira remover o bot (ele não sairá da call até que este comando seja executado)🎧')
    }
});


client.login(token);