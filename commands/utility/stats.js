const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const Character = require("../../models/Character");
const { connectToDatabase } = require("../../utility/dbConnection");
require("dotenv").config();

const ALLOWED_ROLE_ID = process.env.ROLE_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Retrieve character stats")
    .addStringOption((option) =>
      option
        .setName("character_name")
        .setDescription("The name of the character")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await connectToDatabase();
      console.log("Connected to the database");

      const characterName = interaction.options.getString("character_name");
      console.log("Searching for character:", characterName);

      const character = await Character.findOne({
        name: { $regex: new RegExp(`^${characterName}$`, "i") },
      });
      if (!character) {
        return await interaction.reply({
          content: `No character found with the name ${characterName}`,
          ephemeral: true,
        });
      }

      const embed = new EmbedBuilder()
        .setAuthor({
          name: character.name,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`✏️ Gear Stats for ${character.name} (${character.class})`)
        .addFields(
          {
            name: "👑 Character",
            value: character.name,
            inline: true,
          },
          {
            name: "🚨 Class",
            value: character.class,
            inline: true,
          },
          {
            name: "🏆 Guild",
            value: "Reassembled",
            inline: true,
          },
          {
            name: "💥 Combat Power",
            value: character.combatPower?.toString() || "N/A",
            inline: false,
          },
          {
            name: "🧠 Stats",
            value: `**Strength:** ${character.strength}\n**Dexterity:** ${character.dexterity}\n**Wisdom:** ${character.wisdom}\n**Perception:** ${character.perception}`,
            inline: true,
          },
          {
            name: "⚔️ Basic Effects",
            value: `**Hit Chance:** ${character.hitChance}\n**Ranged Defense:** ${character.rangedDefense}\n**Magic Defense:** ${character.magicDefense}\n**Melee Defense:** ${character.meleeDefense}`,
            inline: true,
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: false,
          },
          {
            name: "🏃‍♂️ Evasion",
            value: `**Melee Evasion:** ${character.meleeEvasion}\n**Ranged Evasion:** ${character.rangedEvasion}\n**Magic Evasion:** ${character.magicEvasion}`,
            inline: true,
          },
          {
            name: "🛡️ Endurance",
            value: `**Melee Endurance:** ${character.meleeEndurance}\n**Ranged Endurance:** ${character.rangedEndurance}\n**Magic Endurance:** ${character.magicEndurance}`,
            inline: true,
          }
        )
        .setColor("#633ff3")
        .setTimestamp()
        .setImage(character.imageUrl);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in stats command:", error);
      if (error.name === "MongooseError") {
        console.error("Mongoose error details:", error.message);
      }
      await interaction.reply({
        content:
          "There was an error while retrieving the character data. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
