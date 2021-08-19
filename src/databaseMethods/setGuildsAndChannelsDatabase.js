import db from 'quick.db'

export function setGuildsAndChannelsDatabase(setGuild, setChannel) {
    const database = new db.table('database'),
        getGuilds = database.get('idGuild');

    for (let j = 0; j < getGuilds.length; j++) {

        if (setGuild === getGuilds[j]) {
            database.set(`idChannels.${j}`, setChannel)
            return true;
        }
    }
    database.push('idGuild', setGuild)
    database.push('idChannel', setChannel)
    return false;
}