import { motion, AnimatePresence } from "motion/react";
import { Edit2, Lock, Trophy, ListOrdered, Package, Gift, ShieldCheck } from "lucide-react";
import { useState, ReactNode, memo, useMemo, useCallback } from "react";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

type CampaignStyle = "single" | "leaderboard" | "fixed" | "reward";

interface CampaignStyleContent {
  id: CampaignStyle;
  icon: any;
  label: string;
  mechanic: string;
}

const CAMPAIGN_STYLES: CampaignStyleContent[] = [
  {
    id: "single",
    icon: Trophy,
    label: "Single Win",
    mechanic: "A single prize valued at [prize_value] will be awarded to the participant achieving the highest verified score or performance. Entry requires a qualifying spend of £[minimum_spend] and participation is limited to [max_players] players where applicable.",
  },
  {
    id: "leaderboard",
    icon: ListOrdered,
    label: "Leaderboard",
    mechanic: "Prizes valued at [prize_value] will be awarded to the highest-ranked participants on the leaderboard, with ties resolved by earliest qualifying score submission. Entry requires a qualifying spend of £[minimum_spend] and participation may be limited to [max_players] players.",
  },
  {
    id: "fixed",
    icon: Package,
    label: "Fixed Pool",
    mechanic: "Prizes from a fixed reward pool, each valued at [prize_value], are awarded to qualifying participants while supplies remain available. Entry requires a qualifying spend of £[minimum_spend] and participation may be limited to [max_players] players.",
  },
  {
    id: "reward",
    icon: Gift,
    label: "Reward for All",
    mechanic: "All eligible participants will receive the stated reward valued at [prize_value], subject to successful participation verification. Entry requires a qualifying spend of £[minimum_spend] and participation may be limited to [max_players] players.",
  },
];

const PREFIX = "This promotion is operated by [Merchant Legal Name], trading as [Merchant Trading Name] (“the Promoter”), using the Playe platform. Entry may require a qualifying purchase and successful gameplay participation as defined within the campaign settings. No purchase is necessary where a free entry route is available. Prizes are non-transferable and no cash alternative is offered. The Promoter reserves the right to amend, suspend, or withdraw the campaign where necessary for legal, technical, or operational reasons. Personal data will be processed in accordance with applicable UK data protection laws for campaign administration, prize fulfilment, and fraud prevention purposes.";

const Tooltip = memo(function Tooltip({ children }: { children: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.1 }}
      className="absolute bottom-full mb-3 px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-md text-[9px] font-black tracking-widest uppercase text-white/90 whitespace-nowrap z-50 pointer-events-none"
    >
      {children}
    </motion.div>
  );
});

const HighlightedText = memo(function HighlightedText({ text, isEditable, disableHighlight }: { text: string; isEditable: boolean; disableHighlight?: boolean }) {
  const parts = useMemo(() => text.split(/(\[.*?\])/g), [text]);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <span 
              key={i} 
              className={disableHighlight ? "text-inherit" : "text-[#007AFF] font-medium"}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
});

const EditableText = memo(function EditableText({ 
  children, 
  value: initialValue,
  onSave,
  isEditable = true,
  tooltipLabel,
  disableHighlight,
  isSubtle
}: { 
  children?: ReactNode; 
  value?: string;
  onSave?: (val: string) => void;
  isEditable?: boolean;
  tooltipLabel?: string;
  disableHighlight?: boolean;
  isSubtle?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue || "");

  const handleSave = useCallback(() => {
    onSave?.(value);
    setIsEditing(false);
  }, [onSave, value]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleEditTrigger = useCallback((e: React.MouseEvent) => {
    if (isEditable) {
      e.stopPropagation();
      setIsEditing(true);
    }
  }, [isEditable]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (isEditing && isEditable) {
    return (
      <div className="inline-block w-full my-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 animate-in fade-in zoom-in-95 duration-150">
        <textarea
          autoFocus
          className="w-full h-32 bg-transparent border-none text-[15px] text-white/90 placeholder:text-white/20 resize-none outline-none font-sans leading-relaxed"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-bold tracking-widest uppercase text-white/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-[11px] font-bold tracking-widest uppercase transition-colors shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  const defaultTooltip = isEditable ? "Click to edit section" : "Required for legal compliance";
  const displayTooltip = tooltipLabel || defaultTooltip;

  return (
    <motion.span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleEditTrigger}
      animate={{
        color: (isHovered && isEditable) 
          ? "rgba(255, 255, 255, 0.85)" 
          : isSubtle 
            ? "rgba(255, 255, 255, 0.4)" 
            : isEditable 
              ? "rgba(255, 255, 255, 0.5)" 
              : "rgba(255, 255, 255, 0.4)",
      }}
      transition={{ duration: 0.1 }}
      className={`relative inline px-1 -mx-1 rounded-sm transition-all duration-100 ${isEditable ? 'cursor-pointer' : 'cursor-not-allowed group/text'}`}
    >
      <AnimatePresence>
        {isHovered && (
          <Tooltip>{displayTooltip}</Tooltip>
        )}
      </AnimatePresence>
      {children || (initialValue ? <HighlightedText text={initialValue} isEditable={isEditable} disableHighlight={disableHighlight} /> : null)}
    </motion.span>
  );
});

const DEFAULT_NOTE = "[Add optional customer-facing notes for exclusions, qualifying products, or collection instructions here.]";

export default function App() {
  const [activeStyle, setActiveStyle] = useState<CampaignStyle>("single");
  const [merchantNote, setMerchantNote] = useState(DEFAULT_NOTE);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const current = useMemo(() => CAMPAIGN_STYLES.find(s => s.id === activeStyle)!, [activeStyle]);
  const hasChanges = useMemo(() => merchantNote !== DEFAULT_NOTE, [merchantNote]);

  const handleExpand = useCallback(() => {
    if (!isExpanded) setIsExpanded(true);
  }, [isExpanded]);

  const handleSaveApp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Logic for global save
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col p-12 pt-24 selection:bg-white/10">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header - Left Aligned to Card */}
        <div className="mb-10 px-1">
          <h1 className="text-[40px] font-bold tracking-tight text-white leading-none">
            Campaign Legal Framework
          </h1>
        </div>

        {/* Main Card */}
        <motion.div 
          layout
          initial={false}
          animate={{ 
            height: isExpanded ? "auto" : "500px",
          }}
          onClick={handleExpand}
          className={`relative rounded-[2.5rem] bg-[#0c0d0e] border border-white/[0.05] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700 ease-in-out ${!isExpanded ? 'cursor-pointer hover:border-white/10' : ''}`}
        >
          {/* Card Context Padding */}
          <div className="p-14 pb-12">
            {/* Disclaimer Header Section */}
            <div className="mb-10">
              <h2 className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase font-mono mb-2">
                Legal Disclaimer Configuration
              </h2>
              <p className="text-[15px] text-white/40 leading-relaxed max-w-2xl">
                The foundational prefix is locked to ensure regulatory compliance across the Playe platform.
              </p>
            </div>

            {/* Combined Text Content Area */}
            <div className="leading-[1.8] text-[15px] tracking-normal font-normal">
              <div className="flex flex-col gap-6">
                <EditableText isEditable={false} value={PREFIX} />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStyle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="inline"
                  >
                    <EditableText 
                      isEditable={false} 
                      tooltipLabel="CAMPAIGN SPECIFIC"
                      value={`${current.mechanic} Gameplay closes automatically once the campaign ends or all gamepasses have been claimed.`} 
                    />
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <EditableText 
                        value={merchantNote} 
                        onSave={setMerchantNote}
                        tooltipLabel="PROVIDE ADDITIONAL CONTEXT"
                        isSubtle
                        disableHighlight
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Reveal Overlay when collapsed */}
          {!isExpanded && (
            <div className="absolute inset-x-0 bottom-[100px] h-64 bg-gradient-to-t from-[#0c0d0e] via-[#0c0d0e]/95 to-transparent pointer-events-none flex flex-col items-center justify-end pb-12 gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              />
              <span className="text-[10px] font-black tracking-[0.4em] text-white/10 uppercase transition-opacity">Click to View full context</span>
            </div>
          )}

          {/* Screenshot-Style Bottom Controller */}
          <div className="px-10 py-7 border-t border-white/[0.04] bg-white/[0.015] flex items-center justify-center relative backdrop-blur-3xl">
            {/* Center: Campaign Style Toggles */}
            <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 shadow-inner">
              {CAMPAIGN_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStyle(style.id);
                  }}
                  className={`relative p-2.5 rounded-xl transition-all duration-100 group/btn ${
                    activeStyle === style.id
                      ? "text-white"
                      : "text-white/20 hover:text-white/50"
                  }`}
                >
                  <style.icon className="w-4 h-4" />
                  <AnimatePresence>
                    {activeStyle === style.id && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white/10 border border-white/10 rounded-xl -z-10 shadow-lg shadow-black/20"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/btn:opacity-100 transition-all duration-200 pointer-events-none z-50 translate-y-1 group-hover/btn:translate-y-0">
                    <div className="px-3 py-1.5 rounded-xl bg-[#1a1b1c] border border-white/10 shadow-2xl whitespace-nowrap">
                      <span className="text-[9px] font-black tracking-widest uppercase text-white/80">{style.label}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right: Save Trigger - Absolute Positioned */}
            <div className="absolute right-10 flex items-center">
              <AnimatePresence>
                {hasChanges && (
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0.8, opacity: 0, x: 20 }}
                    whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveApp}
                    className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-[10px] tracking-[0.15em] uppercase shadow-2xl shadow-white/5 transition-colors"
                  >
                    Save
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

