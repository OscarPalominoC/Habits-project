import { AnimatePresence, motion } from "framer-motion";
import useUIStore from "../store/uiStore";

const colorMap = {
  gold: "border-gold-500/40 bg-gold-500/10 text-gold-300",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
};

const iconMap = {
  xp: "⚡",
  levelup: "🆙",
  achievement: "🏅",
};

export default function XPNotification() {
  const notifications = useUIStore((s) => s.notifications);
  const remove = useUIStore((s) => s.removeNotification);

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.85 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border backdrop-blur-sm font-semibold text-sm pointer-events-auto cursor-pointer ${
              colorMap[n.color] || colorMap.gold
            }`}
            onClick={() => remove(n.id)}
          >
            <span className="text-base">{iconMap[n.type] || "✨"}</span>
            <span>
              {n.type === "achievement" ? (
                <span>{n.icon} {n.title}</span>
              ) : (
                n.message
              )}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
