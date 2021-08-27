import 'dotenv/config'
const { url } = process.env
import ytdl from 'ytdl-core'

export async function immediateEntry(idChannel, client) {

    try {
        let broadcast = null,
            stream = ytdl(url)
        broadcast = client.voice.createBroadcast();
        broadcast.play(stream)
        const channelReconect = client.channels.cache.get(idChannel) || await client.channels.fetch(idChannel);
        await channelReconect.join();
        let connection = await channelReconect.join();
        connection.play(broadcast);

    } catch (e) {
        console.log("erro ao conectar : " + e)
        console.log("reconectando()")
    }
}