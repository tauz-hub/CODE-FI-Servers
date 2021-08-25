import db from 'quick.db'
const database = new db.table('database');
import 'dotenv/config'
const { url } = process.env
import ytdl from 'ytdl-core'


let broadcast = null,
    stream = ytdl(url)

export async function immediateEntry(idChannel, client) {

    try {

        broadcast = client.voice.createBroadcast();
        broadcast.play(stream)
        const channelReconect = client.channels.cache.get(idChannel) || await client.channels.fetch(idChannel);
        await channelReconect.join();
        let connection = await channelReconect.join();
        connection.play(stream);

    } catch (e) {
        console.log("erro ao conectar : " + e)
    }
}