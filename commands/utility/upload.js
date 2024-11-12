const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { connectToDatabase } = require("../../utility/dbConnection");
const Character = require("../../models/Character");
require("dotenv").config();

const ALLOWED_ROLE_ID = process.env.ROLE_ID;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("upload")
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
      if (!interaction.member.roles.cache.has(ALLOWED_ROLE_ID)) {
        return await interaction.reply({
          content: "You do not have permission to use this command.",
          ephemeral: true,
        });
      }
      await connectToDatabase();

      const characterName = interaction.options.getString("character_name");
      const characterClass = interaction.options.getString("class");
      const combatPower = interaction.options.getNumber("combat_power");
      const strength = interaction.options.getNumber("strength");
      const dexterity = interaction.options.getNumber("dexterity");
      const wisdom = interaction.options.getNumber("wisdom");
      const perception = interaction.options.getNumber("perception");
      const hitChance = interaction.options.getNumber("hit_chance");
      const rangedDefense = interaction.options.getNumber("ranged_defense");
      const magicDefense = interaction.options.getNumber("magic_defense");
      const meleeDefense = interaction.options.getNumber("melee_defense");
      const meleeEvasion = interaction.options.getNumber("melee_evasion");
      const rangedEvasion = interaction.options.getNumber("ranged_evasion");
      const magicEvasion = interaction.options.getNumber("magic_evasion");
      const meleeEndurance = interaction.options.getNumber("melee_endurance");
      const rangedEndurance = interaction.options.getNumber("ranged_endurance");
      const magicEndurance = interaction.options.getNumber("magic_endurance");
      const characterImage =
        interaction.options.getAttachment("character_image");

      const characterData = {
        name: characterName,
        class: characterClass,
        combatPower,
        strength,
        dexterity,
        wisdom,
        perception,
        hitChance,
        rangedDefense,
        magicDefense,
        meleeDefense,
        meleeEvasion,
        rangedEvasion,
        magicEvasion,
        meleeEndurance,
        rangedEndurance,
        magicEndurance,
        imageUrl: characterImage.url,
        userId: interaction.user.id,
      };

      await Character.findOneAndUpdate({ name: characterName }, characterData, {
        upsert: true,
        new: true,
      });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: characterName,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        })
        .setTitle(`✏️ Gear Stats for ${characterName} (${characterClass})`)
        .addFields(
          {
            name: "👑 Character",
            value: characterName,
            inline: true,
          },
          {
            name: "🚨 Class",
            value: characterClass,
            inline: true,
          },
          {
            name: "🏆 Guild",
            value: "Reassembled",
            inline: true,
          },
          {
            name: "💥 Combat Power",
            value: combatPower.toString(),
            inline: false,
          },
          {
            name: "🧠 Stats",
            value: `**Strength:** ${strength}\n**Dexterity:** ${dexterity}\n**Wisdom:** ${wisdom}\n**Perception:** ${perception}`,
            inline: true,
          },
          {
            name: "⚔️ Basic Effects",
            value: `**Hit Chance:** ${hitChance}\n**Ranged Defense:** ${rangedDefense}\n**Magic Defense:** ${magicDefense}\n**Melee Defense:** ${meleeDefense}`,
            inline: true,
          },
          {
            name: "\u200b",
            value: "\u200b",
            inline: false,
          },
          {
            name: "🏃‍♂️ Evasion",
            value: `**Melee Evasion:** ${meleeEvasion}\n**Ranged Evasion:** ${rangedEvasion}\n**Magic Evasion:** ${magicEvasion}`,
            inline: true,
          },
          {
            name: "🛡️ Endurance",
            value: `**Melee Endurance:** ${meleeEndurance}\n**Ranged Endurance:** ${rangedEndurance}\n**Magic Endurance:** ${magicEndurance}`,
            inline: true,
          }
        )
        .setColor("#633ff3")
        .setTimestamp()
        .setImage(characterImage.url);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("Error in upload command:", error);
      await interaction.reply({
        content: "There was an error while uploading the character data.",
        ephemeral: true,
      });
    }
  },
};
