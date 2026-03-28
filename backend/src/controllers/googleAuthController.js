const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

exports.googleAuth = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ error: 'Could not retrieve email from Google account' });
    }

    // Check if user already exists
    let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    let user;

    if (userResult.rows.length === 0) {
      // Create new user (no password needed for OAuth users)
      const newUser = await db.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, 'student')
         RETURNING id, name, email, role, created_at`,
        [name, email.toLowerCase(), `google_oauth_${googleId}`]
      );
      user = newUser.rows[0];
    } else {
      user = userResult.rows[0];
    }

    const token = generateToken(user.id);
    const { password_hash, ...userWithoutPassword } = user;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ user: userWithoutPassword });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ error: 'Invalid Google credential' });
  }
};
