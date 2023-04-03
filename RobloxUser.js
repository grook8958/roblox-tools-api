const axios = require('axios');
const noblox = require('noblox.js');

class RobloxUser {
    constructor(username) {
        this.username = username;
        
    }

    async search() {
        this.id = await this.getId();
        console.log(this.id)
        if (this.id === false) {
            throw "Error: Couldn't find the user."
        }
        this.displayName = await this.getDisplayName();
        this.pastUsernames = await this.getPastUsernames();
        this.USMCgroups = await this.getUSMCGroups();
        this.USMCrank = await this.getUSMCRank();
        this.profilePictureURL = await this.getHeadShotThumbnail();
    }
    
    async getDisplayName() {
        const res = await axios.get(`https://users.roblox.com/v1/users/${this.id}`)
        return res.data.displayName
    }

    async getId() {
        const userId = await noblox.getIdFromUsername(this.username).catch(err => {
            console.error(err)
            return false
        });
        return userId;
    }

    async getPastUsernames() {
        const res = await axios.get(`https://users.roblox.com/v1/users/${this.id}/username-history?limit=10&sortOrder=Asc`)
        let names = '';
        if (res.data.data.length >= 0) {
            names = 'None'
        }
        for (const username of res.data.data) {
            names += username.name + ', '
        }
        return names
    }

    async getUSMCGroups() {
        const groupNames = {
            5656013: 'MP',
            5656009: 'TECOM',
            6308363: 'MARSOC (MRTC)',
            5656027: 'MARSOC (MRR)',
            6182042: 'MARSOC (MRSG)',
            8217959: 'MARFORCOM (4MD)',
            6451373: 'MARFORCOM (2MD)',
            6167040: 'MARFORCOM (1MD)',
            6167220: 'MARFORCOM (3MAW)',
            8418619: 'MARFORCOM (FORECON)',
            8418619: 'MP (SRT)',
            6302171: 'MP (MPS)',
            1: 'Divisionless',
            0: 'Civilian'
            
        }
        const USMCgroups = [5656013, 5656009, 6308363, 5656027, 6182042, 8217959, 6451373, 6167040, 6167220, 8418619]
        let groupsStr = ''
        const groupsIn = [];
        for (const group of USMCgroups) {
            const rank = await noblox.getRankInGroup(group, this.id);
            if (rank > 0) groupsIn.push(group);
        }
        
        if (groupsIn.includes(5656013) && (groupsIn.includes(8418619) || groupsIn.includes(6302171))) {
            groupsIn.splice(groupsIn.indexOf(5656013), 1);
        }

        for (const group of groupsIn) {
            groupsStr += `${groupNames[group]}, `
        }

        const usmcRank = await noblox.getRankInGroup(5655676, this.id);
        if (groupsStr.length <= 0 && usmcRank > 0) {
            groupsStr = groupNames[1] + ' ,';
        }
        
        if (usmcRank === 0) groupsStr = groupNames[0] + ' ,';

        return groupsStr.replace(/[,\s]+$/gm, '');
    }

    async getUSMCRank() {
        const rank = await noblox.getRankNameInGroup(5655676, this.id);
        return rank;
    }

    async getHeadShotThumbnail() {
        const data = await noblox.getPlayerThumbnail(this.id, '720x720', 'png', true, 'headshot');
        return data[0].imageUrl;
    }

    toJSON() {
        const { username, USMCgroups, pastUsernames, id, displayName, USMCrank, profilePictureURL } = this
        return {
            username,
            USMCgroups,
            pastUsernames,
            id,
            displayName,
            USMCrank,
            profilePictureURL
        }
    }
}

module.exports = RobloxUser;
