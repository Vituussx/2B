const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require('discord.js');
const canvacord = require('canvacord');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const Level = require('../../models/Level');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('Você só consegue rodar este comando dentro de um servidor');
      return;
    }

    await interaction.deferReply();

    const mentionedUserId = interaction.options.get('target-user')?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserId
          ? `${targetUserObj.user.tag} não tem nenhum nível ainda. Tente de novo depois de algumas mesnaagens dessa pessoa`
          : "Você não tem nenhum nível ainda. Converse mais um pouco e tente de novo"
      );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      '-_id userId level xp'
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank = allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    const { Font } = require('canvacord');
    Font.loadDefault();

    const rank = new canvacord.RankCardBuilder()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setStatus(targetUserObj.presence.status)
      .setProgressBar('#FFC300', 'COLOR')
      .setUsername(targetUserObj.user.username)
      .setDiscriminator(targetUserObj.user.discriminator);
      
      const image = await rank.build({ format: 'png',});
      const attachment = new AttachmentBuilder(image);
      interaction.editReply({ files: [attachment] });
      
  },

  name: 'level',
  description: "Mostra o level dos usuários",
  options: [
    {
      name: 'usuário',
      description: 'O level de quem você quer ver?',
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
