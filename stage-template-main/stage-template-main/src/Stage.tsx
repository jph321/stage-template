export default defineStage({
    id: "astraea-artificial-memory",
    name: "Astraea Artificial Memory",
    description: "Tracks stats, spell creation, memory recall, and divine events for Josh in Astraea.",
    version: "1.0.0",

    memory: {
        artificialMemories: [],
        stats: {
            level: 10,
            hp: "60%",
            mana: "30%",
            battlePower: 150,
            reputation: "Hero of the Gates",
            location: "Outskirts of Fortuna",
            equipped: ["Echo Blade", "Guardian’s Mantle"],
            spells: ["Atomic Rain", "Healing Rain", "Mana Shield"],
        },
        statHistory: [],
    },

    gui: {
        widgets: [
            {
                type: "sidebar",
                name: "Josh's Status",
                fields: [
                    { label: "Level", value: (mem) => mem.stats.level },
                    { label: "HP", value: (mem) => mem.stats.hp },
                    { label: "Mana", value: (mem) => mem.stats.mana },
                    { label: "Battle Power", value: (mem) => mem.stats.battlePower },
                    { label: "Reputation", value: (mem) => mem.stats.reputation },
                    { label: "Location", value: (mem) => mem.stats.location },
                    { label: "Equipped", value: (mem) => mem.stats.equipped?.join(", ") },
                    { label: "Spells", value: (mem) => mem.stats.spells?.join(", ") },
                ],
            },
        ],
    },

    functions: {
        updateStat({ input, memory }) {
            const oldValue = memory.stats[input.statName];
            memory.stats[input.statName] = input.newValue;
            memory.statHistory.push({
                change: `${input.statName} ${oldValue} → ${input.newValue}`,
                reason: input.reason || "manual update",
                timestamp: new Date().toISOString(),
            });
            return { confirmation: `Updated ${input.statName}` };
        },
        addMemory({ input, memory }) {
            memory.artificialMemories.push({
                event: input.event,
                tags: input.tags || [],
                importance: input.importance || "normal",
                timestamp: input.timestamp || new Date().toISOString(),
            });
            return { status: "Memory logged." };
        },
    },

    onInput({ input, memory, functions }) {
        const spellTrigger = input.text.match(/(?:Unlocked|New|Created) spell: (.+?) \[(.+?)\] – (.+)/i);
        if (spellTrigger) {
            const [_, name, rank, desc] = spellTrigger;
            const spell = `${name} [${rank}] – ${desc}`;
            memory.stats.spells.push(spell);
            functions.addMemory({
                event: `Learned spell: ${spell}`,
                tags: ["spell", "creation"],
                importance: "high",
            });
        }

        const damageMatch = input.text.match(/took (\\d+) damage/i);
        if (damageMatch) {
            const amount = parseInt(damageMatch[1], 10);
            const oldHp = parseInt(memory.stats.hp.replace("%", ""));
            const newHp = Math.max(oldHp - amount, 0);
            memory.stats.hp = `${newHp}%`;
            memory.statHistory.push({
                change: `HP ${oldHp}% → ${newHp}%`,
                reason: `Damage event detected`,
                timestamp: new Date().toISOString(),
            });
        }
    },

    onOutput({ output, memory }) {
        const recent = memory.artificialMemories.slice(-2);
        if (recent.length > 0) {
            output.text += `\n\n[Memory Recall]\n- ${recent.map(m => m.event).join('\n- ')}`;
        }
    },

    settings: {
        scanDepth: 4,
        tokenBudget: 1500,
        recursiveScanning: true,
    },
});
