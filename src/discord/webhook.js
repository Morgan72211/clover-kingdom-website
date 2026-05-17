const axios = require('axios');

module.exports = async (title, content, author, rank) => {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return console.warn('No webhook URL');

  const embed = {
    title: `📢 ${title}`,
    description: content.length > 4000 ? content.substring(0, 4000) + '...' : content,
    color: 0x5865F2,
    fields: [{ name: 'Posted by', value: `${author} (${rank})`, inline: true }],
    timestamp: new Date().toISOString(),
    footer: { text: 'Clover Kingdom' }
  };

  try {
    await axios.post(url, { username: 'Clover Kingdom', embeds: [embed] });
    console.log('Sent to Discord');
  } catch (error) {
    console.error('Webhook failed:', error.message);
    throw error;
  }
};