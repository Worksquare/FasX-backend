const gravatar = require('gravatar');

const generateAvatar = (email) => {
  // generate a URL for the Gravatar that uses HTTPS
  const avatarUrl = gravatar.url(email, {
    protocol: 'https',
    s: '200', // size: 200x200
    r: 'PG', // rating: PG
    d: 'identicon', // default: identicon
  });
  return avatarUrl;
};

module.exports = generateAvatar;