// Central configuration file for Clover Kingdom Portal
// Shared by both client (frontend) and server (backend)

export const config = {
  // ==========================================
  // WEBSITE METADATA
  // ==========================================
  websiteMetadata: {
    title: "Clover Kingdom",
    description: "Welcome to the Clover Kingdom Magic Portal. Apply for squads, submit appeals, and keep up with kingdom announcements.",
    logoSymbol: "🍀",
    logoText: "CloverKingdom",
    guildInviteLink: "https://discord.gg/cloverkingdom"
  },

  // ==========================================
  // DISCORD GUILD & ROLE VERIFICATION
  // ==========================================
  discordRoles: {
    guildId: "123456789012345678", // Discord Server ID
    adminRoleIds: [
      "1507787508082147338", // Captain Role ID
      "1507789103712829643", // Vice-Captain Role ID
      "1371564142640500896", // Staff Role ID
      "1348106618864271410"  // Magic Emperor Role ID
    ]
  },

  // ==========================================
  // FORM & SYSTEM VALIDATION SETTINGS
  // ==========================================
  formSettings: {
    appealsEnabled: true,
    applicationsEnabled: true,
    maxAnnouncementLength: 2000,
    maxEventDescriptionLength: 1000
  },

  // ==========================================
  // STAFF PROFILES (No avatars or quotes)
  // ==========================================
  staffProfiles: [
    {
      name: "Gale",
      role: "Wizard King",
      magic: "Ice"
    },
    {
      name: "Suki",
      role: "Silver Sovereign",
      magic: "Fire Magic"
    },
    {
      name: "Popzi",
      role: "Purple Sovereign",
      magic: "Fire Magic"
    },
    {
      name: "Gamern",
      role: "Royal Magic Knights Captain",
      magic: "Time Magic"
    },
   {
      name: "Washed",
      role: "Silver Eagles Captain",
      magic: "Anti-Magic"
    },
   {
      name: "Koji",
      role: "Golden Dawn Captain",
      magic: "n/a"
    },
   {
      name: "Fire",
      role: "Coral Peacocks Captain",
      magic: "Ice"
    },
   {
      name: "Sunny",
      role: "Blue Rose Knights Captain",
      magic: "Plant"
   }
  ],

  // ==========================================
  // MAGIC KNIGHT SQUADS (All 9 official squads)
  // ==========================================
  magicKnightSquads: [
    {
      id: "golden-dawn",
      name: "Golden Dawn",
      emblem: "🏆",
      stars: 5,
      captain: "Koji",
      description: "The most prestigious magic knight squad, composed almost exclusively of high-ranking nobles with exceptional mana capacity.",
      color: "#f59e0b" // Gold
    },
    {
      id: "black-bulls",
      name: "Black Bulls",
      emblem: "🐂",
      stars: 4,
      captain: "Nova",
      description: "A collection of destructive misfits who consistently defy expectations, surpass limits, and cause chaos wherever they go.",
      color: "#ff4757" // Crimson/Red
    },
    {
      id: "silver-eagles",
      name: "Silver Eagles",
      emblem: "🦅",
      stars: 4,
      captain: "Washed",
      description: "Led by royalty, this squad utilizes pure, refined magic attributes like steel and mercury to execute precise military tactics.",
      color: "#a4b0be" // Silver
    },
    {
      id: "crimson-lions",
      name: "Crimson Lion Kings",
      emblem: "🦁",
      stars: 4,
      captain: "Ant",
      description: "A fiery squad that values passion, strength, and unwavering integrity. Home to powerful fire magic users of royal blood.",
      color: "#ea580c" // Orange
    },
    {
      id: "green-mantises",
      name: "Green Mantises",
      emblem: "🦗",
      stars: 3,
      captain: "Dino",
      description: "An eccentric squad specializing in slashing and physical magic, led by a captain who loves cutting down mages.",
      color: "#10b981" // Green
    },
    {
      id: "blue-rose",
      name: "Blue Rose Knights",
      emblem: "🌹",
      stars: 4,
      captain: "Sunny",
      description: "A disciplined, highly coordinated squad consisting primarily of powerful female mages who wield specialized briar and ice magic.",
      color: "#3b82f6" // Blue
    },
    {
      id: "coral-peacocks",
      name: "Coral Peacocks",
      emblem: "🦚",
      stars: 3,
      captain: "Fire",
      description: "An enigmatic squad known for creative, visual magic attributes. Led by a captain who is almost always asleep, dreaming of battles.",
      color: "#ec4899" // Pink/Rose
    },
    {
      id: "purple-orcas",
      name: "Purple Orcas",
      emblem: "🐳",
      stars: 3,
      captain: "Parkerr",
      description: "A defensive-oriented squad specializing in barrier constructs, shielding tactics, and safeguarding the kingdom's major checkpoints.",
      color: "#a855f7" // Purple
    },
    {
      id: "azure-deer",
      name: "Azure Deer",
      emblem: "🦌",
      stars: 3,
      captain: "Panda",
      description: "A squad centered around raw creative talent and artistic magic types, led by the youngest captain in history who fights using paint.",
      color: "#06b6d4" // Azure/Cyan
    }
  ],

  // ==========================================
  // MAGIC ATTRIBUTES (For Ceremony game)
  // ==========================================
  magicAttributes: [
    {
      name: 'Wind Magic (4-Leaf Clover)',
      icon: '🌪️',
      description: 'An exceptionally elegant and swift attribute. Allows you to control storm currents, levitate, and slice through targets with pure pressurized wind.',
      color: '#10b981'
    },
    {
      name: 'Anti-Magic (5-Leaf Clover)',
      icon: '😈',
      description: 'A legendary, dark attribute that nullifies all other magic. Summons massive iron swords capable of repelling, absorbing, and cutting through spells.',
      color: '#ff4757'
    },
    {
      name: 'Fire Magic',
      icon: '🔥',
      description: 'A destructive, high-temperature offense attribute. Manifests explosive flame claws, fireballs, and fire armor to incinerate enemy defenses.',
      color: '#f97316'
    },
    {
      name: 'Light Magic',
      icon: '⚡',
      description: 'One of the fastest magic types in existence. Allows you to move at light-speed, bend ray paths, and throw high-intensity energy blades.',
      color: '#eab308'
    },
    {
      name: 'Spatial Magic',
      icon: '🌀',
      description: 'A highly advanced attribute enabling spatial manipulation. Tear open portals, teleport instantly, or erase physical objects from space.',
      color: '#a855f7'
    },
    {
      name: 'Time Magic',
      icon: '⏳',
      description: 'An incredibly rare attribute. Capture, store, and manipulate time flow to freeze opponents, accelerate movements, or reverse fatal damage.',
      color: '#06b6d4'
    }
  ]
};
