import { getSettings } from '../db/repository';

export interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

export interface DiscordLogOptions {
  title: string;
  description?: string;
  color?: number; // hex color code
  fields?: DiscordEmbedField[];
  footer?: string;
  author?: {
    name: string;
    icon_url?: string;
  };
}

export async function sendDiscordLog(options: DiscordLogOptions) {
  try {
    const settings = await getSettings().catch(() => null);
    const webhookUrl = settings?.discordWebhookUrl || process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      console.warn('sendDiscordLog: no DISCORD_WEBHOOK_URL configured, skipping log:', options.title);
      return;
    }

    const payload = {
      username: 'MCPE Galaxy Bot',
      avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      embeds: [
        {
          title: options.title,
          description: options.description || '',
          color: options.color ?? 0x8b5cf6, // Default purple
          fields: options.fields || [],
          timestamp: new Date().toISOString(),
          footer: {
            text: options.footer || 'MCPE Galaxy Tier Testing System • Official Audit Log',
            icon_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'
          },
          ...(options.author ? { author: options.author } : {})
        }
      ]
    };

    // Non-blocking asynchronous dispatch
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn('Discord webhook dispatch error (safe ignore):', err?.message || err);
    });
  } catch (err) {
    console.warn('sendDiscordLog error:', err);
  }
}
