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
   },
   {
      name: "Parkerr",
      role: "Purple Orcas Captain",
      magic: "Time"
    },
   {
      name: "Dino",
      role: "Green Praying Mantis Captain",
      magic: "Imitation"
    },
   {
      name: "Nova",
      role: "Black Bulls Captain",
      magic: "Blood V2"
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
    // --- COMMON ---
    {
      name: "Wind Magic (Common)",
      icon: "🌪️",
      description: "A fundamental element allowing you to manipulate air currents, summon gusts, and slice through targets with pressurized wind.",
      color: "#10b981"
    },
    {
      name: "Water Magic (Common)",
      icon: "💧",
      description: "A versatile element enabling the creation and control of high-pressure water streams, protective bubbles, and torrential waves.",
      color: "#3b82f6"
    },
    {
      name: "Earth Magic (Common)",
      icon: "⛰️",
      description: "A sturdy element that controls rocks, sand, and soil to manifest defensive walls, stone armor, and heavy geological strikes.",
      color: "#a16207"
    },
    {
      name: "Fire Magic (Common)",
      icon: "🔥",
      description: "A highly destructive element that conjures flames to launch fireballs, melt defenses, and manifest explosive offense.",
      color: "#ef4444"
    },
    {
      name: "Healing Magic (Common)",
      icon: "💚",
      description: "A support attribute focused on accelerating cellular recovery, closing wounds, and replenishing a mage's mana supply.",
      color: "#22c55e"
    },
    // --- UNCOMMON ---
    {
      name: "Ice Magic (Uncommon)",
      icon: "❄️",
      description: "A freezing attribute that crystallizes moisture into sharp glaciers, defensive mirrors, and ice-cold temperature zones.",
      color: "#38bdf8"
    },
    {
      name: "Lightning Magic (Uncommon)",
      icon: "⚡",
      description: "A high-speed offensive attribute that channels electricity to move faster than the eye can see and launch electro-charged bolts.",
      color: "#eab308"
    },
    {
      name: "Mirror Magic (Uncommon)",
      icon: "🪞",
      description: "A specialized reflection attribute. Duplicate yourself, reflect magical spells, or redirect energy beams across coordinates.",
      color: "#94a3b8"
    },
    {
      name: "Sand Magic (Uncommon)",
      icon: "⏳",
      description: "A dry particle attribute. Command vast sandstorms, trap targets in quicksand, or shape hardened sandstone weaponry.",
      color: "#d97706"
    },
    {
      name: "Glass Magic (Uncommon)",
      icon: "💎",
      description: "A brittle but sharp attribute. Conjure thousands of glass shards to pierce defenses, deflect light, or form razor-sharp barriers.",
      color: "#cbd5e1"
    },
    {
      name: "Steel Magic (Uncommon)",
      icon: "🛡️",
      description: "A highly durable material attribute. Shape steel swords, shields, and armor to overwhelm opponents with pure physical defenses.",
      color: "#64748b"
    },
    // --- RARE ---
    {
      name: "Cotton Magic (Rare)",
      icon: "☁️",
      description: "A soft, cushioning attribute. Summon massive cotton clouds to absorb heavy impacts, bind targets, or float through the sky.",
      color: "#f8fafc"
    },
    {
      name: "Thorn Magic (Rare)",
      icon: "🥀",
      description: "A lethal, piercing plant attribute. Grow endless briars of thorns that drain mana, constrict enemies, and build defensive thickets.",
      color: "#dc2626"
    },
    {
      name: "Light Magic (Rare)",
      icon: "☀️",
      description: "One of the fastest magic attributes in history. Shift at light-speed, bend ray paths, and shoot high-intensity energy rays.",
      color: "#fef08a"
    },
    {
      name: "Memor Magic (Rare)",
      icon: "🧠",
      description: "A mind-based attribute. Read the memories of others, alter cognitive thoughts, or project mental illusions to deceive targets.",
      color: "#ec4899"
    },
    {
      name: "Barrier Magic (Rare)",
      icon: "🧱",
      description: "A defensive construction attribute. Create impenetrable magical barriers, forcefields, and hex shields to protect allies.",
      color: "#f59e0b"
    },
    {
      name: "Compound Magic (Rare)",
      icon: "🧪",
      description: "A unique attribute that combines multiple magical spells and elements into single, highly complex cooperative attacks.",
      color: "#84cc16"
    },
    // --- LEGENDARY ---
    {
      name: "Spatial Magic (Legendary)",
      icon: "🌀",
      description: "An advanced attribute allowing spatial manipulation. Tear open teleportation portals or erase physical objects from space.",
      color: "#8b5cf6"
    },
    {
      name: "Union Magic (Legendary)",
      icon: "🤝",
      description: "A synchronization attribute that merges the caster's magic power with another mage or spirit to reach unparalleled forms.",
      color: "#06b6d4"
    },
    {
      name: "Curse Magic (Legendary)",
      icon: "💀",
      description: "A dark, malicious attribute. Place persistent debuffs, drain life force over time, or afflict targets with status ailments.",
      color: "#4b5563"
    },
    {
      name: "Imitation Magic (Legendary)",
      icon: "👥",
      description: "A copying attribute. Replicate another mage's spell library and utilize their magic as if it were your own.",
      color: "#6b7280"
    },
    {
      name: "World Tree Magic (Legendary)",
      icon: "🌳",
      description: "A legendary royal tree attribute. Summon ancient roots that drain mana from entire battlefields to fuel your own spells.",
      color: "#15803d"
    },
    {
      name: "Severing Magic (Legendary)",
      icon: "🪓",
      description: "A slicing attribute that adapts. Create magical blades that can cut through any spell, defense, or physical barrier over time.",
      color: "#10b981"
    },
    {
      name: "Mercury Magic (Legendary)",
      icon: "🧪",
      description: "A fluid-metal attribute. Manipulate toxic liquid silver into shields, spears, or rain showers that change density dynamically.",
      color: "#cbd5e1"
    },
    // --- MYTHICAL ---
    {
      name: "Fire Spirit Magic (Mythical)",
      icon: "🧚‍♀️🔥",
      description: "A mythical attribute granted by Salamander, the Fire Spirit. Unleash absolute, incinerating heat that vaporizes oceans.",
      color: "#f97316"
    },
    {
      name: "Wind Spirit Magic (Mythical)",
      icon: "🧚‍♀️🌪️",
      description: "A mythical attribute granted by Sylph, the Wind Spirit. Harness storm tempests, fly freely, and execute absolute wind strikes.",
      color: "#10b981"
    },
    {
      name: "Water Spirit Magic (Mythical)",
      icon: "🧚‍♀️💧",
      description: "A mythical attribute granted by Undine, the Water Spirit. Command the seas, heal entire squads, and control massive tidal forces.",
      color: "#3b82f6"
    },
    {
      name: "Earth Spirit Magic (Mythical)",
      icon: "🧚‍♀️⛰️",
      description: "A mythical attribute granted by Gnome, the Earth Spirit. Manipulate tectonic plates, command diamonds, and build impenetrable forts.",
      color: "#a16207"
    },
    {
      name: "Time Magic (Mythical)",
      icon: "⌛",
      description: "An incredibly rare, celestial attribute. Capture, store, and manipulate time flow to freeze opponents or reverse fatal damage.",
      color: "#06b6d4"
    },
    {
      name: "Key Magic (Mythical)",
      icon: "🔑",
      description: "A mystical lock-and-key attribute. Open gateways to locked dimensions, unlock sealed mana pools, or bind enemy abilities.",
      color: "#eab308"
    },
    // --- DIVINE ---
    {
      name: "Anti-Magic (Divine)",
      icon: "😈",
      description: "A legendary, dark attribute that nullifies all other magic. Summons massive iron swords capable of repelling and cutting through spells.",
      color: "#ff4757"
    },
    {
      name: "Dark Magic (Divine)",
      icon: "🖤",
      description: "A slow but high-density offensive attribute. Wield shadows, absorb incoming light/magic, and slash through dimensions.",
      color: "#1e1b4b"
    },
    {
      name: "Kotodama Magic [Word Speech] (Divine)",
      icon: "🗣️",
      description: "A supreme reality-shaping attribute. Manifest physical objects, command spells, or heal injuries simply by speaking them into existence.",
      color: "#f43f5e"
    },
    {
      name: "Gravity Magic (Divine)",
      icon: "🪐",
      description: "A cosmic force attribute. Bend space, summon meteors, crush opponents with high-gravity fields, or float by negating weight.",
      color: "#7c3aed"
    },
    {
      name: "Forbidden Magic (Divine)",
      icon: "👁️",
      description: "A dangerous, dark attribute drawing mana from the underworld. Grants massive power boosts but permanently alters the caster's soul.",
      color: "#991b1b"
    }
  ]
};
