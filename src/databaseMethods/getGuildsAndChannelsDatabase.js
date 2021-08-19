import db from 'quick.db'

export function getGuildsAndChannelsDatabase() {
    const database = new db.table('database');
    let getChannels = [],
        getGuilds = [];

    let receiveIdGuildDatabase = database.get('idGuild'),
        receiveIdChannelDatabase = database.get('idChannel');


    if (receiveIdGuildDatabase) {
        for (let i = 0; i < receiveIdGuildDatabase.length; i++) {

            if (receiveIdGuildDatabase[i] !== null) {
                getGuilds.push(receiveIdGuildDatabase[i]);
                getChannels.push(receiveIdChannelDatabase[i]);
            }
        }
    }
    return [getGuilds, getChannels];
}