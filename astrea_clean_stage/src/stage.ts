
// @ts-ignore
export default defineStage({
  id: "astraea-no-gui",
  name: "Astraea No GUI",
  description: "Stripped-down version with no GUI to bypass Chub rendering bug.",
  version: "1.0.0",

  memory: {
    stats: {
      level: 1,
      hp: "100%",
      mana: "100%",
      equipped: ["Invisible Sword"],
      spells: ["Whisper Bind [E] – Binds soundlessly"]
    },
    artificialMemories: []
  },

  // GUI intentionally omitted due to rendering crash bug in Chub

  functions: {},
  onInput() {},
  onOutput() {},

  settings: {
    scanDepth: 2,
    tokenBudget: 500,
    recursiveScanning: false
  }
});
