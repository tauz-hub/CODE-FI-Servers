import db from 'quick.db'

export function setGuildsAndChannelsDatabase(setGuild, setChannel) {
    const database = new db.table('database'),
        getGuilds = database.get('idGuilds');

    for (let j = 0; j < getGuilds.length; j++) {

        if (setGuild === getGuilds[j]) {
            database.set(`idChannels.${j}`, setChannel)
            return true;
        }
    }
    database.push('idGuilds', setGuild)
    database.push('idChannels', setChannel)
    return false;
}