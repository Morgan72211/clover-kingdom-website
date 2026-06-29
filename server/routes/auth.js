import express from 'express';
import dotenv from 'dotenv';
import { config } from '../../config.js';

dotenv.config();

const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const DEV_MODE = process.env.DEV_MODE === 'true';

/**
 * Route to check current login state
 */
router.get('/user', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

/**
 * Login route
 */
router.get('/discord', (req, res) => {
  if (DEV_MODE) {
    // If dev mode, log in as mock staff member automatically
    req.session.user = {
      username: "Captain Yami (Mock)",
      avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
      id: "999999999999999999",
      roles: ["Captain", "Staff", "Magic Emperor"],
      isStaff: true
    };
    return res.redirect('/admin');
  }

  // Real Discord Authorization URI
  const scope = encodeURIComponent('identify guilds guilds.members.read');
  const redirect = encodeURIComponent(REDIRECT_URI);
  const authorizeUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=${scope}`;
  
  res.redirect(authorizeUrl);
});

/**
 * OAuth Callback Route
 */
router.get('/callback', async (req, res) => {
  if (DEV_MODE) {
    return res.redirect('/admin');
  }

  const code = req.query.code;
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  try {
    // 1. Exchange code for OAuth token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const tokenData = await tokenResponse.json();
    if (tokenData.error) {
      return res.status(400).send(`OAuth Error: ${tokenData.error_description}`);
    }

    // 2. Fetch User Profile
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userResponse.json();

    // 3. Fetch User Member Info in specific Guild (requires Bot Token)
    const guildId = process.env.DISCORD_GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;
    
    let isStaff = false;
    let roles = [];

    if (guildId && botToken) {
      const memberResponse = await fetch(`https://discord.com/api/guilds/${guildId}/members/${userData.id}`, {
        headers: { Authorization: `Bot ${botToken}` }
      });

      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        
        // Fetch guild roles to map IDs to Names (optional, for profile rendering)
        const rolesResponse = await fetch(`https://discord.com/api/guilds/${guildId}/roles`, {
          headers: { Authorization: `Bot ${botToken}` }
        });
        
        if (rolesResponse.ok) {
          const guildRoles = await rolesResponse.json();
          const userRoleNames = guildRoles
            .filter(r => memberData.roles.includes(r.id))
            .map(r => r.name);
            
          roles = userRoleNames;
        } else {
          roles = memberData.roles; // Fallback to raw IDs if mapping fails
        }
        
        // Directly check if user has any admin role ID configured
        isStaff = config.discordRoles.adminRoleIds.some(roleId => memberData.roles.includes(roleId));
      }
    }

    // Set user session object
    req.session.user = {
      username: `${userData.username}#${userData.discriminator || '0000'}`,
      avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${userData.id % 5}.png`,
      id: userData.id,
      roles: roles,
      isStaff: isStaff || DEV_MODE // Always allow in DEV_MODE
    };

    res.redirect('/admin');
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    res.status(500).send('Authentication failed');
  }
});

/**
 * Logout route
 */
router.get('/logout', (req, res) => {
  req.session = null;
  res.json({ success: true });
});

export default router;
