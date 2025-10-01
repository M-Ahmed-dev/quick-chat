const generateToken = (userId) => {
  const token = token.sign({ userId }, process.env.JWT_SECRET);
  return token;
};

module.exports = generateToken;
