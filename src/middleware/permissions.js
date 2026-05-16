const rankHierarchy = {
  'Vice Captain': 1,
  'Captain': 2,
  'Sovereign': 3,
  'Wizard King': 4,
  'Suki': 5
};

const permissions = (requiredRank) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    const userRank = req.user.rank;
    const userLevel = rankHierarchy[userRank];
    const requiredLevel = rankHierarchy[requiredRank];

    if (!userLevel || !requiredLevel) {
      return res.status(500).json({ error: 'Invalid rank configuration.' });
    }

    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        error: `Access denied. Requires ${requiredRank} or higher.`,
        yourRank: userRank,
        requiredRank: requiredRank
      });
    }

    next();
  };
};

module.exports = permissions;