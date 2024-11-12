const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Character = require("../../models/Character");
const { connectToDatabase } = require("../../utility/dbConnection");
require("dotenv").config();

const ALLOWED_ROLE_ID = process.env.OFFICER_ROLE_ID;
const BOT_DEVELOPER_ID = process.env.DEV_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete a character from the database")
    .addStringOption((option) =>
      option
        .setName("character_name")
        .setDescription("The name of the character to delete")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Check if the user has the required role
      if (
        !interaction.member.roles.cache.has(ALLOWED_ROLE_ID) &&
        interaction.user.id !== BOT_DEVELOPER_ID
      ) {
        return await interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }

      await connectToDatabase();

      const characterName = interaction.options.getString("character_name");

      // Check if the character exists
      const character = await Character.findOne({
        name: { $regex: new RegExp(`^${characterName}$`, "i") },
      });

      if (!character) {
        return await interaction.reply({
          content: `No character found with the name ${characterName}`,
          ephemeral: true,
        });
      }

      // Check if the user is the bot developer or the character owner
      const isBotDeveloper = interaction.user.id === BOT_DEVELOPER_ID;
      const isCharacterOwner = character.userId === interaction.user.id;

      if (!isBotDeveloper && !isCharacterOwner) {
        return await interaction.reply({
          content: "You do not have permission to delete this character.",
          ephemeral: true,
        });
      }

      // Delete the character
      await Character.deleteOne({ _id: character._id });

      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Character Deleted")
        .setDescription(
          `The character ${character.name} has been successfully deleted from the database.`
        )
        .addFields(
          { name: "Character Name", value: character.name, inline: true },
          { name: "Class", value: character.class, inline: true },
          { name: "Deleted By", value: interaction.user.tag }
        )
        .setTimestamp();

      // Send the response as ephemeral
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error("Error in delete command:", error);
      await interaction.reply({
        content:
          "There was an error while deleting the character. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
