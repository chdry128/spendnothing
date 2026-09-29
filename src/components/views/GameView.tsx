import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { CHALLENGES } from '../../data/products';
import { formatPrice, formatRealCost } from '../../utils/formatters';
import {
  Flame,
  Timer,
  Swords,
  Trophy,
  Award,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Share2,
} from 'lucide-react';

export const GameView: React.FC = () => {
  const {
    userProfile,
    claimTrophy,
    activeChallenge,
    startChallenge,
    tickChallenge,
    getTotalMSRP,
    showToast,
    setActiveTab,
    currency,
  } = useStore();

  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [speedrunSeconds, setSpeedrunSeconds] = useState(43.8);

  const currentCartTotal = getTotalMSRP();

  // Tick active timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeedrunSeconds((prev) => (prev > 0.1 ? Number((prev - 0.1).toFixed(1)) : 60.0));
      tickChallenge();
    }, 100);
    return () => clearInterval(timer);
  }, [tickChallenge]);

  const featuredChallenge = CHALLENGES[0];
  const delta = currentCartTotal - featuredChallenge.targetBudget;

  const handleStartSpeedRun = () => {
    startChallenge('speedrun-1m', 1000000, 60, 500);
    setActiveTab('play');
    showToast(`Speed Run Active! You have 60 seconds to hit ${formatPrice(1000000, currency)} ±${formatPrice(500, currency)}.`, 'CLOCK IS TICKING');
  };

  const handleAcceptDuel = () => {
    setActiveTab('play');
    showToast(`Duel Accepted vs @OverkillKing (${formatPrice(14280000, currency)})! Start building your counter-cart.`, 'PVP DUEL READY');
  };

  return (
    <div className="flex flex-col gap-6 pt-2 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hub Banner & Intro */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#1a1c1a] text-[#faf9f6] text-[10px] font-extrabold uppercase tracking-widest rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ba0900] animate-pulse" />
            The Fantasy Arena • Season 01
          </span>
          <span className="px-2 py-0.5 bg-[#6cf8bb]/60 border border-[#006c49]/20 text-[#00714d] text-[10px] font-extrabold uppercase tracking-wider rounded-md">
            {formatRealCost(currency)} Risk Arena
          </span>
        </div>

        <h1 className="font-bodoni font-bold text-3xl uppercase text-[#1a1c1a] leading-none tracking-tight mt-1">
          Shopping as a Competitive Sport.
        </h1>

        <p className="text-xs text-[#5d5c5b] leading-relaxed">
          Test your reckless spending instincts against brutal timers, absurd algorithmic constraints, and internet peers. Zero real dollars spent. Absolute delusion guaranteed.
        </p>

        {/* Global Chaos Meter / Ticker */}
        <div className="mt-1 bg-[#f4f3f0] p-3 rounded-xl border border-[#1a1c1a]/15 flex items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ba0900] flex-shrink-0 animate-pulse" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-extrabold text-[#5d5c5b] uppercase tracking-wider truncate">
                Global Chaos Meter (24H)
              </span>
              <span className="font-bodoni font-bold text-sm text-[#1a1c1a] truncate">
                {formatPrice(84204190400, currency, { compact: true })} Fake Spent
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end flex-shrink-0">
            <span className="text-[10px] font-extrabold text-[#006c49] uppercase tracking-wider">
              14,290 Carts
            </span>
            <span className="text-[10px] text-[#5d5c5b]">Obliterated</span>
          </div>
        </div>
      </section>

      {/* 2. Featured Time-Attack Hero Challenge */}
      <section className="bg-white rounded-2xl p-4 border-2 border-[#1a1c1a] shadow-tactile flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#ba0900] text-white text-[10px] font-extrabold uppercase tracking-wider rounded shadow-sm">
            <Flame className="w-3.5 h-3.5" />
            <span>Daily Speed Run • 45s Remaining</span>
          </div>
          <span className="font-bodoni font-bold text-xs bg-[#ffdad4] text-[#400100] px-2 py-0.5 rounded border border-[#ba0900]/20">
            PAR: ±{formatPrice(500, currency)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="font-bodoni font-bold text-2xl uppercase text-[#1a1c1a] leading-tight">
            Blow Exactly {formatPrice(1000000, currency, { compact: true })} in 60 Seconds
          </h2>
          <p className="text-xs text-[#5d5c5b] leading-relaxed">
            Hit within <strong className="text-[#1a1c1a]">±{formatPrice(500, currency)}</strong> of {formatPrice(1000000, currency)} without tipping over. Max 1 luxury jet/island item (≤ {formatPrice(600000, currency, { compact: true })} cap). No cart recalculations.
          </p>
        </div>

        {/* Gauge & Progress Telemetry */}
        <div className="bg-[#f4f3f0] p-3 rounded-xl border border-[#1a1c1a]/15 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-[#ba0900]" />
              <span className="text-[10px] font-extrabold uppercase text-[#5d5c5b] tracking-wider">
                Target Clock
              </span>
            </div>
            <span className="font-bodoni font-black text-xl text-[#ba0900] tracking-wider">
              00:{speedrunSeconds.toFixed(1).padStart(4, '0')}s
            </span>
          </div>

          {/* Target Progress Bar */}
          <div className="w-full bg-[#e9e8e5] h-3 rounded-full overflow-hidden border border-[#1a1c1a]/10 p-0.5">
            <div
              className="bg-[#ba0900] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(8, (currentCartTotal / 1000000) * 100))}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-[#5d5c5b] tracking-wider">
            <span>
              Current: <strong className="text-[#1a1c1a] font-bodoni text-xs">{formatPrice(currentCartTotal, currency)}</strong>
            </span>
            <span className={delta === 0 ? 'text-[#006c49]' : 'text-[#ba0900]'}>
              Delta: {delta >= 0 ? `+${formatPrice(delta, currency)}` : `-${formatPrice(Math.abs(delta), currency)}`}
            </span>
            <span>Target: {formatPrice(1000000, currency, { compact: true })}</span>
          </div>
        </div>

        {/* Unlockable Trophy Bounty */}
        <div className="flex items-center gap-2 bg-[#e9e8e5] px-3 py-2 rounded-xl border border-[#1a1c1a]/10">
          <Award className="w-5 h-5 text-[#ba0900] flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-extrabold uppercase text-[#5d5c5b]">
              Current Attempt Bounty
            </span>
            <span className="text-xs font-extrabold uppercase text-[#1a1c1a] truncate">
              Title: Certified Deranged Hedonist
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleStartSpeedRun}
            className="w-full bg-[#ba0900] hover:bg-[#920500] text-white py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border border-[#1a1c1a] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Speed Run →</span>
          </button>

          <button
            onClick={() => setLeaderboardOpen(!leaderboardOpen)}
            className="w-full bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#1a1c1a] py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a]/20 shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Trophy className="w-4 h-4 text-[#ba0900]" />
            <span>View Leaderboard (12,840 Entries)</span>
          </button>

          {leaderboardOpen && (
            <div className="bg-[#f4f3f0] p-3 rounded-xl border border-[#1a1c1a]/20 text-xs flex flex-col gap-2 animate-in fade-in">
              <span className="font-extrabold uppercase text-[#5d5c5b] text-[10px] tracking-wider">
                Top Speed Run Pilots (Today)
              </span>
              <div className="flex justify-between font-bold text-[#1a1c1a] border-b border-[#e4e2dc] pb-1">
                <span>1. @SpeedSpender</span>
                <span className="text-[#006c49]">00:18.4s (Delta {formatRealCost(currency)})</span>
              </div>
              <div className="flex justify-between font-semibold text-[#5d5c5b]">
                <span>2. @ZeroDebtBaron</span>
                <span>00:21.1s (Delta -{formatPrice(120, currency)})</span>
              </div>
              <div className="flex justify-between font-semibold text-[#5d5c5b]">
                <span>3. @FictionalWhale</span>
                <span>00:24.9s (Delta +{formatPrice(300, currency)})</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 3. Active Arenas */}
      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-[#ba0900] uppercase tracking-widest">
              Curated Gauntlets
            </span>
            <h3 className="font-bodoni font-bold text-xl uppercase text-[#1a1c1a]">
              Active Arenas
            </h3>
          </div>
          <span className="text-xs text-[#5d5c5b]">4 Playable</span>
        </div>

        <div className="flex flex-col gap-3">
          {CHALLENGES.slice(1).map((ch) => (
            <div
              key={ch.id}
              className="bg-white p-4 rounded-2xl border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ba0900]">
                    {ch.difficulty} {ch.winRate ? `• ${ch.winRate} Win Rate` : ''}
                  </span>
                  <h4 className="font-bodoni font-bold text-lg uppercase text-[#1a1c1a] leading-tight">
                    {ch.title}
                  </h4>
                  <span className="text-xs text-[#5d5c5b] leading-relaxed">
                    {ch.description}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#f4f3f0] border border-[#1a1c1a]/15 flex items-center justify-center text-[#1a1c1a] flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#ba0900]" />
                </div>
              </div>

              <div className="bg-[#f4f3f0] px-3 py-1.5 rounded-lg border border-[#1a1c1a]/10 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-[#5d5c5b] uppercase">
                  Badge Reward
                </span>
                <span className="font-extrabold text-[#006c49] uppercase">
                  🏅 {ch.badgeReward}
                </span>
              </div>

              <button
                onClick={() => {
                  startChallenge(ch.id, ch.targetBudget, ch.timeLimitSeconds, ch.toleranceDelta);
                  setActiveTab('play');
                  showToast(`Challenge "${ch.title}" Started!`, 'Go build your imaginary cart!');
                }}
                className="w-full bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#1a1c1a] py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a]/20 shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <span>Play Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Versus / Head-to-Head Showdown Banner */}
      <section className="bg-[#1a1c1a] text-white rounded-2xl p-4 border-2 border-[#1a1c1a] shadow-tactile-lg flex flex-col gap-3 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#ba0900]/25 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-[#ffdad4] uppercase tracking-widest">
            1v1 PvP Duel
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#006c49] text-white text-[10px] font-extrabold uppercase">
            Live Battle
          </span>
        </div>

        <div>
          <h3 className="font-bodoni font-bold text-2xl uppercase leading-tight">
            Can You Beat This Cart?
          </h3>
          <p className="text-xs text-[#c8c6c5] mt-0.5">
            Match the ridiculous extravagance of today's syndicate leader with zero real cash.
          </p>
        </div>

        {/* Matchup Comparison */}
        <div className="grid grid-cols-2 gap-2 bg-white/10 p-3 rounded-xl border border-white/10 relative">
          {/* Competitor Left */}
          <div className="flex flex-col gap-1 pr-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-[#ba0900] flex items-center justify-center text-[10px] font-bold">
                OK
              </div>
              <span className="text-xs font-bold truncate">@OverkillKing</span>
            </div>
            <span className="font-bodoni font-bold text-lg text-[#ffb4a7]">
              {formatPrice(14280000, currency)}
            </span>
            <span className="text-[10px] text-[#c8c6c5]">
              Cart: 3 Submarines + 1 Faberge Egg
            </span>
          </div>

          {/* Center VS Badge */}
          <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-[#ba0900] text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md z-10">
            VS
          </div>

          {/* You / Contender Right */}
          <div className="flex flex-col gap-1 pl-3 text-right">
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-bold text-[#6cf8bb] truncate">You</span>
              <div className="w-5 h-5 rounded-full bg-[#006c49] flex items-center justify-center text-[10px] font-bold">
                YOU
              </div>
            </div>
            <span className="font-bodoni font-bold text-lg text-[#6cf8bb]">
              {formatPrice(currentCartTotal, currency)}
            </span>
            <span className="text-[10px] text-[#4edea3]">
              {currentCartTotal > 0 ? 'Draft ready to battle' : `Cart empty • Ready to draft`}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAcceptDuel}
            className="w-full bg-[#6cf8bb] hover:bg-[#4edea3] text-[#002113] py-3 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#002113] shadow-tactile active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <Swords className="w-4 h-4" />
            <span>Accept Challenge & Remix Cart</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Unlimited Shopping 1v1 PvP',
                  text: 'I just challenged @OverkillKing on Unlimited Shopping! Join the zero-dollar arena:',
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard?.writeText?.(window.location.href);
                showToast('PvP challenge link copied!', 'Send to group chat');
              }
            }}
            className="w-full bg-transparent hover:bg-white/10 text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-white/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Challenge Group Chat</span>
          </button>
        </div>
      </section>

      {/* 5. Player Status & Delusion Rank Tier */}
      <section className="bg-[#f4f3f0] rounded-2xl p-4 border border-[#1a1c1a] shadow-tactile-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5d5c5b]">
            Syndicate Dossier
          </span>
          <span className="text-[10px] font-extrabold text-[#ba0900] uppercase bg-[#ffdad4] border border-[#ba0900]/20 px-2 py-0.5 rounded">
            {userProfile.prestige}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#5d5c5b] uppercase">Current Status</span>
          <h4 className="font-bodoni font-bold text-xl uppercase tracking-tight text-[#1a1c1a]">
            {userProfile.statusTier}
          </h4>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-[#1a1c1a]/15 text-center shadow-xs">
          <div className="flex flex-col">
            <span className="font-bodoni font-black text-xl text-[#ba0900]">
              {userProfile.wins}
            </span>
            <span className="text-[9px] font-extrabold uppercase text-[#5d5c5b]">
              Wins
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bodoni font-black text-xl text-[#1a1c1a] truncate">
              {formatPrice(userProfile.totalFakeSpent, currency, { compact: true })}
            </span>
            <span className="text-[9px] font-extrabold uppercase text-[#5d5c5b]">
              Fake Spent
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bodoni font-black text-xl text-[#006c49]">
              Top 6%
            </span>
            <span className="text-[9px] font-extrabold uppercase text-[#5d5c5b]">
              Percentile
            </span>
          </div>
        </div>

        {/* Satirical Trophy Claim Button */}
        <button
          onClick={claimTrophy}
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-[#1a1c1a] shadow-tactile-sm active:translate-x-0.5 active:translate-y-0.5 transition-all ${
            userProfile.trophyClaimed
              ? 'bg-[#6cf8bb]/60 text-[#005236]'
              : 'bg-[#efeeeb] hover:bg-[#e3e2e0] text-[#1a1c1a]'
          }`}
        >
          <Trophy className="w-4 h-4 text-[#ba0900]" />
          <span>
            {userProfile.trophyClaimed
              ? `🏆 Trophy Claimed! (${formatRealCost(currency)} Value Added)`
              : 'Claim Participation Trophy (100% Pretend)'}
          </span>
        </button>
      </section>
    </div>
  );
};
