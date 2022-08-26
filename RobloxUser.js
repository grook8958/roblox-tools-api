const axios = require('axios');
const noblox = require('noblox.js');
//RobloUser
class RobloxUser {
    constructor(username) {
        this.username = username;
        
    }

    async search() {
        this.id = await this.getId();
        if (this.id === false) {
            throw "Error: Couldn't find the user."
        }
        this.displayName = await this.getDisplayName();
        this.pastUsernames = await this.getPastUsernames();
        this.USMCgroups = await this.getUSMCGroups();
        this.USMCrank = await this.getUSMCRank();
        //WIP
        this.profilePictureURL = `https://www.roblox.com/headshot-thumbnail/image?userId=${encodeURIComponent(this.id)}&width=100&height=100&format=png`
    }
    
    async getDisplayName() {
        const res = await axios.get(`https://users.roblox.com/v1/users/${this.id}`)
        return res.data.displayName
    }

    async getId() {
        const userId = await noblox.getIdFromUsername(this.username).catch(err => {
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
            1: 'Divisionless',
            0: 'Civilian'
            
        }
        const USMCgroups = [5656013, 5656009, 6308363, 5656027, 6182042, 8217959, 6451373, 6167040, 6167220, 8418619]
        let groups = ''
        for (const group of USMCgroups) {
            const rank = await noblox.getRankInGroup(group, this.id);
            if (rank > 0) {
                groups += `- ${groupNames[group]\n}`
            }
        }

        if (groups.length <= 0) {
            groups = 'None';
        }

        return groups
    }

    async getUSMCRank() {
        const rank = noblox.getRankNameInGroup(5655676, this.id);
        return rank;
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
