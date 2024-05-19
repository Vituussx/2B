const { Client, Interaction, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../../models/AutoRole');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply('O Autorole não foi configuado para este servidor. Use `/autorole-configure` para configurá-lo.');
        return;
      }

      await AutoRole.findOneAndDelete({ guildId: interaction.guild.id });
      interaction.editReply('O Autorole já foi desabilitado neste servidor. Use `/autorole-configure` configurá-lo de novo.');
    } catch (error) {
      console.log(error);
    }
  },

  name: 'autorole-disable',
  description: 'Desabilitar o Autorole neste servidor.',
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
