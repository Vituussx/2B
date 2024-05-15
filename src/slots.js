require('dotenv').config();
const { Slots } = require('discord-gamecord');

module.exports = {
    name: 'slots',
    description: 'start slot game.',

    run: async (client, message, args) => {
        const Game = new Slots({
            message: message,
            isSlashGame: false,
            embed: {
                title: 'Slot Machine',
                color: '#00c7fe'
            },

            slots: ['🍇','🍊','🍌','🍋']

        });

        Game.startGame();
        Game.on('gameOver', result => {
            return;

        });
    }
}
client.login();