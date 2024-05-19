const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'Você só pode usar este comando em um servidor',
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.get('user')?.value || interaction.member.id;

    await interaction.deferReply();

    const user = await User.findOne({ userId: targetUserId, guildId: interaction.guild.id });

    if (!user) {
      interaction.editReply(`<@${targetUserId}> ainda não tem perfil.`);
      return;
    }

    interaction.editReply(
      targetUserId === interaction.member.id
        ? `O seu saldo é **${user.balance}**`
        : `O saldo de <@${targetUserId}> é **${user.balance}**`
    );
  },

  name: 'saldo',
  description: "Veja o valor em uma conta",
  options: [
    {
      name: 'usuário',
      description: 'O saldo de quem você quer ver?',
      type: ApplicationCommandOptionType.User,
    },
  ],
};
