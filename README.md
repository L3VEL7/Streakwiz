4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the bot:
   ```bash
   node src/index.js
   ```

## Railway.app Deployment

1. **Prepare Your Bot**
   - Create a Discord application and bot at [Discord Developer Portal](https://discord.com/developers/applications)
   - Enable "Message Content Intent" in the Bot settings
   - Copy your bot token

2. **Set Up Railway Project**
   - Fork this repository to your GitHub account
   - Go to [Railway.app](https://railway.app)
   - Create a new project
   - Choose "Deploy from GitHub repo"
   - Select your forked repository

3. **Configure Environment Variables**
   - In your Railway project, go to Variables
   - Add a new variable:
     - Key: `DISCORD_TOKEN`
     - Value: Your Discord bot token

4. **Deploy**
   - Railway will automatically deploy your bot
   - The deployment logs will show when your bot is online

5. **Add Bot to Server**
   - Generate an invite link from Discord Developer Portal
   - Select the minimal permissions listed above
   - Use the link to add the bot to your server

## Usage

1. After adding the bot to your server:
   - Use `/setup` to configure trigger words (admin only)
   - Use `/setstreak_limit` to configure how often users can update their streaks (admin only)
     - Options: hourly, daily, or none (unlimited)
     - Important: Set this after configuring trigger words
   - Users can start building streaks by sending messages that exactly match the trigger words
   - Use `/leaderboard` to view rankings for each trigger word
   - The bot will react with 🔥 to confirm streak increments

2. Example Setup:
   ```
   /setup words:daily,workout,study
   /setstreak_limit interval:daily