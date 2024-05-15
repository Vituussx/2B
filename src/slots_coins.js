const { SlashCommandBuilder } = require('discord.js');

const { Slots } = require('discord-gamecord');
const User = require ('../../Schemas.js/userAccount');
const Slots = require('./slots');


module.exports = {
    data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Star the Slots game.')
    .addStringOption(option => option.setName('coins').setDescription('Enter the amount of coins you want to bet.'),setRequired(true)),
    async execute (interaction) {
        const coins = interaction.option.getString('coins');
        const userId = interaction.user.id;
        const user = await User.findOne({ userId });

        if (!user) {
            return interaction.reply({ content: 'You do not have an account. Create one to play slots.', ephemeral: true})

        }

        if(coins <= 0 ||  coins > 100000) {
            return interaction.reply({ content: 'Please enter a valid amount of coins (1-100000)',
                ephemeral: true});
        }

        if (user.balance < coins) {
            return interaction.reply({ content: 'Insufficient balance. Add more coins to PollLayoutType.', ephemeral: true})
        }

        const Game = new Slots({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Slot Machine',
                color: '#00c7fe'
            },
            slots: ['🍇','🍊','🍌','🍋']
        });

        Game.startGame();
        Game.on('gameOver', async result => {
            if(!result === 'lose') {
                const winning = coins * 2;
                await User.findOneAndUpdate({ userId }, {$inc: {balance: winnings}});
                interaction.followup(`Congratulations! You won ${winnings} coins.`);

            }else{
                await User.findOneAndUpdate({ userId }, { $inc: {balance: -coins}});
                interaction.followup(`Better luck next time. Your bet amount has been deducted.`)
            }
        });
    }
}