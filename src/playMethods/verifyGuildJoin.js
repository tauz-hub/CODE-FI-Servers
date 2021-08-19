export function verifyGuildJoin(idGuildsRaw, idChannelsRaw, client) {

    let verifyExistingGuilds = [],
        verifyExistingChannels = [];

    for (let i = 0; i < idGuildsRaw.length; i++) {

        if (client.channels.cache.has(idChannelsRaw[i])) {
            verifyExistingGuilds.push(idGuildsRaw[i])
            verifyExistingChannels.push(idChannelsRaw[i])
        }
    }
    return [verifyExistingGuilds, verifyExistingChannels];
}