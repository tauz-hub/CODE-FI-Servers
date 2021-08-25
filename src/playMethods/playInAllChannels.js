import { verifyGuildJoin } from './verifyGuildJoin.js';
import db from 'quick.db'
const database = new db.table('database')
import 'dotenv/config'
const { url } = process.env
import ytdl from 'ytdl-core'

let broadcast = null,
    stream = null;

export async function playInAllChannels(client) {
    //process.setMaxListeners(0);
    const getDatabase = database.all()
    let channelsAddSucess = []

    for (let i = 0; i < getDatabase.length; i++) {
        let objChannel = getDatabase[i].data
        objChannel = objChannel.replace(/"/g, '')

        console.log(objChannel)
        try {
            const channel = client.channels.cache.get(objChannel) || await client.channels.fetch(objChannel);
            if (channel) {
                console.log(objChannel)
                channelsAddSucess.push(channel)
            }
        } catch (e) {}
    }

    //console.log(channelsAddSucess)
    for (let i = 0; i < channelsAddSucess.length; i++) {
        // process.setMaxListeners(0)
        const channel = channelsAddSucess[i]
        try {
            channel.leave()
            stream = ytdl(url)
            broadcast = client.voice.createBroadcast();
            stream.on('error', console.error);
            broadcast.play(stream);


            const connection = await channel.join();
            connection.play(broadcast);

            console.log(`Conectado ao servidor : ${channel.guild.name}\n No canal :  ${channel.name}\nid: ${getDatabase[i].data}\n-------------------------\n`)

        } catch (e) {
            channel.leave()

            console.log(`Não foi possivel conectar ao servidor : ${channel.guild.name}\n No canal : ${channel.name}\nid: ${getDatabase[i].data}\n-------------------------\n`)
            console.log(`Tentando reconectar => ${channel.guild.name}`)
        }
    }
}