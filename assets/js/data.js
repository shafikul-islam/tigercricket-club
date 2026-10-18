/* ============================================================
   BATON ROUGE TIGERS — SITE CONTENT
   ------------------------------------------------------------
   This is the ONLY file most people need to edit.
   Change text, numbers, players, photos here — no coding needed.
   Everything on the site is rendered from this object.
   ============================================================ */

window.CLUB = {
  /* ---- Identity ---- */
  name: "Baton Rouge Tigers",
  shortName: "BR Tigers",
  tagline: "Student cricket. Championship ambition.",
  subTagline:
    "A student-led cricket club in Baton Rouge, playing in the Louisiana Cricket Association — on the road to becoming the official LSU Cricket Team.",
  foundedYear: 2023, // EDIT: your club's founding year
  league: "Louisiana Cricket Association (LCA)",
  homeCity: "Baton Rouge, Louisiana",

  /* ---- Hero call-to-action links (fill these in later) ---- */
  links: {
    donate: "#donate",
    join: "mailto:batonrougetigers@gmail.com?subject=I want to join the Tigers",
    facebook: "https://www.facebook.com/groups/5829520950495575",
    lca: "https://www.lcacricket.org",
    instagram: "", // add later
    youtube: "", // add later
    email: "batonrougetigers@gmail.com", // EDIT to your real club email
  },

  /* ---- Headline stats (count up on screen) ---- */
  stats: [
    { value: 2023, label: "Established", suffix: "" },
    { value: 16, label: "Active Players", suffix: "" },
    { value: 10, label: "LCA Clubs We Compete With", suffix: "" },
    { value: 1, label: "Dream: LSU Cricket", suffix: "" },
  ],

  /* ---- About section ---- */
  about: {
    heading: "Who We Are",
    body: [
      "The Baton Rouge Tigers are a student-driven cricket club based in Baton Rouge, Louisiana. We compete in the Louisiana Cricket Association (LCA) — a 10-club league born in 2016 with 299+ players across the state.",
      "We are more than a team. We're a growing community of students who love the game and want to put Baton Rouge — and soon, LSU — on the cricketing map. Our goal is to transition into the official LSU Cricket Team, representing the university with pride.",
      "This season is our starting point. We're building the roster, the culture, and the record that earns that recognition.",
    ],
    vision:
      "To become the officially recognized LSU Cricket Team and the strongest student cricket program in Louisiana.",
  },

  /* ---- Current squad ----
     role options: "Captain", "Vice Captain", "Batter", "Bowler",
     "All-rounder", "Wicketkeeper", "Player"  */
  squad: [
    { name: "Sohan", role: "Captain" },
    { name: "Jesbin", role: "Vice Captain" },
    { name: "Adam", role: "Player" },
    { name: "Noman", role: "Player" },
    { name: "Amir", role: "Player" },
    { name: "Pavan", role: "Player" },
    { name: "Anurag", role: "Player" },
    { name: "Srinadh", role: "Player" },
    { name: "Naresh", role: "Player" },
    { name: "Vishal", role: "Player" },
    { name: "Adwait", role: "Player" },
    { name: "Bikram", role: "Player" },
    { name: "Vasu", role: "Player" },
    { name: "Raveen", role: "Player" },
    { name: "Kabir", role: "Player" },
    { name: "Praveen", role: "Player" },
  ],

  /* ---- Alumni (former players) ---- */
  alumni: [
    { name: "Imrul Kayes" },
    { name: "Lijesh" },
    { name: "Sachith" },
    { name: "Sriram" },
    { name: "Raju" },
    { name: "Visal" },
  ],

  /* ---- Special thanks / contributors ---- */
  contributors: [
    { name: "Hari", note: "New Orleans Cricket Club" },
    { name: "Mohsen", note: "Dilwale Cricket Club" },
    { name: "Ibrar Ahmed", note: "KPK Cricket Club" },
  ],

  /* ---- Sponsors ---- */
  sponsors: [
    {
      name: "Singh Jewelers",
      note: "Proud jersey sponsor of the Tigers",
      img: "assets/img/sponsor-singh.webp",
      url: "",
    },
  ],

  /* ---- Gallery photos ---- */
  gallery: [
    { src: "assets/img/team-group.webp", caption: "Match day — the full squad" },
    { src: "assets/img/match-action.webp", caption: "Out in the middle" },
    { src: "assets/img/team-swagat.webp", caption: "Tigers off the field" },
    { src: "assets/img/sponsor-singh.webp", caption: "With our sponsor, Singh Jewelers" },
  ],

  /* ---- Recent results (edit after each match) ---- */
  results: [
    { date: "2025-04-06", opponent: "New Orleans CC", result: "Won", score: "Tigers 142/6 beat NOCC 138/9" },
    { date: "2025-03-23", opponent: "Dilwale CC", result: "Lost", score: "Dilwale 165/5 beat Tigers 159/8" },
    { date: "2025-03-09", opponent: "Khyber Pakhtunkhwa CC", result: "Won", score: "Tigers 178/4 beat KPK 171/7" },
  ],

  /* ---- Donate options (fill in when ready) ---- */
  donate: {
    heading: "Support the Tigers",
    body:
      "We're a student club covering our own ground fees, kit, and tournament entries. Every contribution helps us compete and grow toward LSU recognition.",
    methods: [
      { label: "Zelle", detail: "batonrougetigers@gmail.com", note: "Add your real Zelle" },
      { label: "Venmo", detail: "@BRTigersCricket", note: "Add your real handle" },
      { label: "GoFundMe", detail: "", note: "Paste your campaign link here" },
    ],
  },
};
