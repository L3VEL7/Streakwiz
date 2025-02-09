const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const streakManager = require('../storage/streakManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Configure trigger words for streak tracking')
        .addStringOption(option =>
            option.setName('words')
                .setDescription('Comma-separated list of trigger words')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: 'You need administrator permissions to use this command.',
                ephemeral: true
            });
        }

        const wordsInput = interaction.options.getString('words');
        // Split by comma and handle potential whitespace, filter out empty strings
        const words = wordsInput.split(',')
            .map(word => word.trim())
            .filter(word => word.length > 0);

        if (words.length === 0) {
            return interaction.reply({
                content: 'Please provide at least one trigger word.',
                ephemeral: true
            });
        }

        console.log('Setting up trigger words:', words); // Debug log
        streakManager.setTriggerWords(interaction.guildId, words);

        await interaction.reply({
            content: `Streak tracking configured for the following words: ${words.join(', ')}`,
            ephemeral: true
        });
    },
};