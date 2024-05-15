require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js');

const { Slots } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName ('slots')
    .setDescription('Start slots game.'),
    async execute (interaction ) {
        const Game = new Slots({
           message: interaction,
           isSlashGame: false,
           embed: {
           title: 'Slot Machine',
           color: '#00c7fe'
           },
        })
        slots: ['🍇','🍊','🍌','🍋']

        Game.startGame();
        Game.on('gameOver', result =>{
            return;
        })
    }  
}

client.login(process.env.TOKEN);