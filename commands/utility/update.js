const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const Character = require("../../models/Character");
const { connectToDatabase } = require("../../utility/dbConnection");
require("dotenv").config();

const ALLOWED_ROLE_ID = process.env.ROLE_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Upload character stats")
    .addStringOption((option) =>
      option
        .setName("character_name")
        .setDescription("The name of your character")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("class")
        .setDescription("Your character's class")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("combat_power")
        .setDescription("Your character's combat power")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("strength")
        .setDescription("Your character's strength")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("dexterity")
        .setDescription("Your character's dexterity")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("wisdom")
        .setDescription("Your character's wisdom")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("perception")
        .setDescription("Your character's perception")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("hit_chance")
        .setDescription("Your character's hit chance")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("ranged_defense")
        .setDescription("Your character's ranged defense")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("magic_defense")
        .setDescription("Your character's magic defense")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("melee_defense")
        .setDescription("Your character's melee defense")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("melee_evasion")
        .setDescription("Your character's melee evasion")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("ranged_evasion")
        .setDescription("Your character's ranged evasion")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("magic_evasion")
        .setDescription("Your character's magic evasion")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("melee_endurance")
        .setDescription("Your character's melee endurance")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("ranged_endurance")
        .setDescription("Your character's ranged endurance")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("magic_endurance")
        .setDescription("Your character's magic endurance")
        .setRequired(true)
    )
    .addAttachmentOption((option) =>
      option
        .setName("character_image")
        .setDescription("An image of your character")
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      // Check if the user has the required role
      if (!interaction.member.roles.cache.has(ALLOWED_ROLE_ID)) {
        return await interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }
      await connectToDatabase();

      const characterName = interaction.options.getString("character_name");
      const existingCharacter = await Character.findOne({
        name: characterName,
      });

      if (!existingCharacter) {
        return await interaction.reply({
          content: `No character found with the name ${characterName}`,
          ephemeral: true,
        });
      }

      // Check if the user is the bot developer or the character owner
      const isBotDeveloper = interaction.user.id === process.env.DEV_ID; // Replace with your Discord user ID
      const isCharacterOwner = existingCharacter.userId === interaction.user.id;

      if (!isBotDeveloper && !isCharacterOwner) {
        return await interaction.reply({
          content: "You do not have permission to update this character.",
          ephemeral: true,
        });
      }

      // Prepare update data
      const updateData = {};
      const fields = [
        "class",
        "combat_power",
        "strength",
        "dexterity",
        "wisdom",
        "perception",
        "hit_chance",
        "ranged_defense",
        "magic_defense",
        "melee_defense",
        "melee_evasion",
        "ranged_evasion",
        "magic_evasion",
        "melee_endurance",
        "ranged_endurance",
        "magic_endurance",
      ];

      fields.forEach((field) => {
        const value = interaction.options.get(field)?.value;
        if (value !== undefined) {
          // Use camelCase for the field names to match your MongoDB schema
          updateData[field.replace(/_([a-z])/g, (g) => g[1].toUpperCase())] =
            value;
        }
      });

      const characterImage =
        interaction.options.getAttachment("character_image");
      if (characterImage) {
        updateData.imageUrl = characterImage.url;
      }

      // Update the character
      const updatedCharacter = await Character.findOneAndUpdate(
        { name: characterName },
        updateData,
        { new: true }
      );

      // Create embed for response
      const embed = new EmbedBuilder()
        .setAuthor({
          name: updatedCharacter.name,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(
          `✏️ Gear Stats for ${updatedCharacter.name} (${updatedCharacter.class})`
        )
        .addFields(
          {
            name: "👑 Character",
            value: updatedCharacter.name,
            inline: true,
          },
          {
            name: "🚨 Class",
            value: updatedCharacter.class,
            inline: true,
          },
          {
            name: "🏆 Guild",
            value: "Reassembled",
            inline: true,
          },
          {
            name: "💥 Combat Power",
            value: updatedCharacter.combatPower?.toString() || "N/A",
            inline: false,
          },
          {
            name: "🧠 Stats",
            value: `**Strength:** ${updatedCharacter.strength}\n**Dexterity:** ${updatedCharacter.dexterity}\n**Wisdom:** ${updatedCharacter.wisdom}\n**Perception:** ${updatedCharacter.perception}`,
            inline: true,
          },
          {
            name: "⚔️ Basic Effects",
            value: `**Hit Chance:** ${updatedCharacter.hitChance}\n**Ranged Defense:** ${updatedCharacter.rangedDefense}\n**Magic Defense:** ${updatedCharacter.magicDefense}\n**Melee Defense:** ${updatedCharacter.meleeDefense}`,
            inline: true,
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: false,
          },
          {
            name: "🏃‍♂️ Evasion",
            value: `**Melee Evasion:** ${updatedCharacter.meleeEvasion}\n**Ranged Evasion:** ${updatedCharacter.rangedEvasion}\n**Magic Evasion:** ${updatedCharacter.magicEvasion}`,
            inline: true,
          },
          {
            name: "🛡️ Endurance",
            value: `**Melee Endurance:** ${updatedCharacter.meleeEndurance}\n**Ranged Endurance:** ${updatedCharacter.rangedEndurance}\n**Magic Endurance:** ${updatedCharacter.magicEndurance}`,
            inline: true,
          }
        )
        .setColor("#633ff3")
        .setTimestamp()
        .setImage(updatedCharacter.imageUrl);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in update command:", error);
      await interaction.reply({
        content:
          "There was an error while updating the character data. Please try again later.",
        ephemeral: true,
      });
    }
  },
};
