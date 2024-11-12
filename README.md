# Discord Character Stats Bot

This is a Discord bot that allows users to manage character stats through slash commands. Users can upload, update, retrieve, and delete character information in a structured format using Discord's slash command functionality.

## Features

- **Upload Character Stats**: Allows users to add new character stats to the database.
- **Update Character Stats**: Enables users to update their existing character stats.
- **Retrieve Character Stats**: Users can fetch and view their character stats.
- **Delete Character**: Users can remove their characters from the database.
- **Role-Based Permissions**: Only users with specific roles can use certain commands, ensuring proper access control.

## Commands

### `/upload`

Uploads a new character's stats to the database.

**Parameters:**
- `character_name` (string): The name of your character (required).
- `class` (string): Your character's class (required).
- `combat_power` (number): Your character's combat power (required).
- `strength` (number): Your character's strength (required).
- `dexterity` (number): Your character's dexterity (required).
- `wisdom` (number): Your character's wisdom (required).
- `perception` (number): Your character's perception (required).
- `hit_chance` (number): Your character's hit chance (required).
- `ranged_defense` (number): Your character's ranged defense (required).
- `magic_defense` (number): Your character's magic defense (required).
- `melee_defense` (number): Your character's melee defense (required).
- `melee_evasion` (number): Your character's melee evasion (required).
- `ranged_evasion` (number): Your character's ranged evasion (required).
- `magic_evasion` (number): Your character's magic evasion (required).
- `melee_endurance` (number): Your character's melee endurance (required).
- `ranged_endurance` (number): Your character's ranged endurance (required).
- `magic_endurance` (number): Your character's magic endurance (required).
- `character_image` (attachment): An image of your character (required).

### `/update`

Updates an existing character's stats in the database.

**Parameters:**
- Same as the `/upload` command.

### `/stats`

Retrieves and displays the stats for a specified character.

**Parameters:**
- `character_name` (string): The name of the character whose stats you want to retrieve (required).

### `/delete`

Deletes a specified character from the database.

**Parameters:**
- `character_name` (string): The name of the character you wish to delete (required).

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/captnlucid/thronebot.git
   cd thronebot
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory with the following variables:
    ```text
    BOT_TOKEN=<Bot Token from Discord Developer Portal>
    CLIENT_ID=<The Bot's Client ID>
    MONGODB_URI=<Your MongoDB Connection String>
    ROLE_ID=<Guild Role ID>
    DEV_ID=<Bot Admin ID>
    OFFICER_ROLE_ID=<Guild Officer or Higher ID>   
    ```
    
4. Run the bot:
    ```bash
    node app.js
    ```
### Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request with your changes.
License
This project is licensed under the MIT License - see the LICENSE file for details.
text

### Notes:
1. **Replace Placeholders**: Make sure to replace placeholders like `yourusername`, `your-repo`, and MongoDB connection string with actual values relevant to your project.
2. **Add More Details**: Feel free to add more sections or details based on additional features or configurations you may have in your bot.
3. **License Section**: If you have a specific license for your project, include that in the License section.

This README provides a clear overview of what your bot does, how to set it up, and how to use its features.
