const ranks = { 'Vice Captain': 1, 'Captain': 2, 'Sovereign': 3, 'Wizard King': 4, 'Suki': 5 };

module.exports = (required) => (req, res, next) => {
  const userLevel = ranks[req.user.rank];
  const reqLevel = ranks[required];
  if (!userLevel) return res.status(403).json({ error: 'Invalid rank' });
  if (userLevel >= reqLevel) return next();
  res.status(403).json({ error: `Requires ${required}+` });
};