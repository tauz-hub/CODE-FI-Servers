import db from 'quick.db'
const database = new db.table('database');

export async function immediateEntry(idGuildEntry, stream, broadcastLocal, client) {
    console.log(idGuildEntry)
    let listGuilds = database.get('idGuild'),
        listChannels = database.get('idChannel');

    for (let i = 0; i < listGuilds.length; i++) {
        try {
            if (idGuildEntry === listGuilds[i]) {
                broadcastLocal = client.voice.createBroadcast();
                broadcastLocal.play(stream)
                const channelReconect = client.channels.cache.get(listChannels[i]) || await client.channels.fetch(listChannels[i]);
                await channelReconect.join();
                let connection = await channelReconect.join();
                connection.play(stream);
            }
        } catch (e) {
            console.log("erro ao conectar : " + e)
        }
    }
}