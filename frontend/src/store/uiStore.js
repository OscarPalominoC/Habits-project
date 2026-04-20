import { create } from "zustand";

let notifId = 0;

const useUIStore = create((set) => ({
  notifications: [],

  addXPNotification: (xp, leveledUp = false, newLevel = null, newTitle = null) => {
    const id = ++notifId;
    const items = [];

    if (xp > 0) items.push({ id: id + "_xp", type: "xp", message: `+${xp} XP`, color: "gold" });
    if (leveledUp)
      items.push({
        id: id + "_lvl",
        type: "levelup",
        message: `¡Nivel ${newLevel}!${newTitle ? ` — ${newTitle}` : ""}`,
        color: "violet",
      });

    set((s) => ({ notifications: [...s.notifications, ...items] }));

    // Auto-dismiss after 3s
    items.forEach((item) => {
      setTimeout(() => {
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== item.id) }));
      }, 3000);
    });
  },

  addAchievementNotification: (achievement) => {
    const id = ++notifId + "_ach";
    set((s) => ({
      notifications: [...s.notifications, { id, type: "achievement", ...achievement, color: "emerald" }],
    }));
    setTimeout(() => {
      set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }));
    }, 4000);
  },

  removeNotification: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));

export default useUIStore;
