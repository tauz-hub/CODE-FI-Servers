import { getGuildsAndChannelsDatabase } from '../databaseMethods/getGuildsAndChannelsDatabase.js'
import { verifyGuildJoin } from './verifyGuildJoin.js';

export async function playInAllChannels(stream, broadcast, client) {
    //process.setMaxListeners(0);
    const [idGuildsRaw, idChannelsRaw] = getGuildsAndChannelsDatabase();
    console.log(idGuildsRaw, idChannelsRaw)
    const [idGuilds, idChannels] = verifyGuildJoin(idGuildsRaw, idChannelsRaw, client);
    broadcast = client.voice.createBroadcast();
    stream.on('error', console.error);
    broadcast.play(stream);

    for (let i = 0; i < idGuilds.length; i++) {
        const channel = client.channels.cache.get(idChannels[i]) || await client.channels.fetch(idChannels[i]);
        process.setMaxListeners(0)
        try {
            await channel.leave()

            let connection = await channel.join();
            connection.play(broadcast)

            console.log(`Conectado ao servidor : ${channel.guild.name}\n No canal :  ${channel.name}\nid: ${idChannels[i]}\n-------------------------\n`)

        } catch (e) {
            console.error(e)

            console.log(`Não foi possivel conectar ao servidor : ${channel.guild.name}\n No canal : ${channel.name}\nid: ${idChannels[i]}\n-------------------------\n`)
            console.log(`Tentando reconectar => ${channel.guild.name}`)
        }
    }

}