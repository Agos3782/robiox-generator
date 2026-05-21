export default async function handler(req, res) {
    const username = String(req.query.username ?? '').trim();

    if (!username) {
      return res.status(400).json({ exists: false, error: 'Username is required' });
    }

    try {
      const response = await fetch('https://users.roblox.com/v1/usernames/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernames: [username], excludeBannedUsers: false }),
      });

      if (!response.ok) {
        return res.status(502).json({ exists: false, error: 'Roblox API error' });
      }

      const data = await response.json();
      const exists = Array.isArray(data.data) && data.data.length > 0;
      res.json({ exists });
    } catch {
      res.status(502).json({ exists: false, error: 'Failed to reach Roblox' });
    }
  }
  