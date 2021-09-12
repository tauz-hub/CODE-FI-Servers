import db from 'quick.db'
const database = new db.table('database')
import 'dotenv/config'
const { url } = process.env
import ytdl from 'ytdl-core'

let broadcast = null,
    stream = ytdl(url);

export async function playInAllChannels(client) {
    //process.setMaxListeners(0);
    const getDatabase = database.all()
    let channelsAddSucess = []

    for (let i = 0; i < getDatabase.length; i++) {
        let objChannel = getDatabase[i].data
        objChannel = objChannel.replace(/"/g, '')

        try {
            const channel =  client.channels.cache.get(objChannel) || await client.channels.fetch(objChannel);
            if (channel) {
                channelsAddSucess.push(channel)
            }
        } catch (e) {}
    }

    //console.log(channelsAddSucess)
    for (let i = 0; i < channelsAddSucess.length; i++) {

        const channel = channelsAddSucess[i]
        try {
            channel.leave()
            broadcast = await client.voice.createBroadcast();
            broadcast.play(stream)


            const connection = await channel.join();
            connection.play(broadcast);

            console.log(`Conectado ao servidor : ${channel.guild.name}\n No canal :  ${channel.name}\nid: ${channelsAddSucess[i].id}\n-------------------------\n`)

        } catch (e) {
            channel.leave()

            console.log(`Não foi possivel conectar ao servidor : ${channel.guild.name}\n No canal : ${channel.name}\nid: ${channelsAddSucess[i].id}\n-------------------------\n`)
            console.log(`Tentando reconectar => ${channel.guild.name}` + e)
        }
        console.log("reconexão foi feita com sucesso!")
    }
}
