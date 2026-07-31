import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = "home" | "profile" | "money-input" | "name-input" | "life-input" | "result" | "payment" | "admin-login" | "admin" | "payment-confirmation";

type QuizType = "money" | "name" | "life";

type Gender = "male" | "female" | "other";

interface UserInfo {
  name: string;
  email: string;
  age: string;
  gender: Gender;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  age: string;
  gender: Gender;
  quizType: QuizType;
  headline: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface ResultData {
  quizType: QuizType;
  symbol: string;
  symbolLabel: string;
  headline: string;
  description: string;
  detail: string;
  socialCount: number;
}

// ─── Life Path Questions ──────────────────────────────────────────────────────

const lifeQuestions = [
  {
    question: "Та ямар орчинд хамгийн эрч хүчтэй байдаг вэ?",
    options: ["Байгал, нам гүм", "Хот, олон хүн", "Гэр, бүл хамт", "Ажил, үр бүтээл"],
  },
  {
    question: "Та өглөө босоход эхлээд юу бодох вэ?",
    options: ["Өнөөдөр юу хийх вэ?", "Энэ өдөр гоё болоосой", "Хэн нэгэнтэй уулзмаар байна", "Амар тайван л байвал болно"],
  },
  {
    question: "Найз нөхдийн дунд та ямар хүн вэ?",
    options: ["Шийдвэр гаргагч", "Инээлдүүлэгч", "Сонсогч, зөвлөгч", "Бүгдийг зохион байгуулагч"],
  },
  {
    question: "Хамгийн том айдас тань юу вэ?",
    options: ["Ганцаардах", "Бүтэлгүйтэх", "Хаягдах", "Бусдаас доогуур байх"],
  },
  {
    question: "Таны хамгийн хүчтэй тал юу вэ?",
    options: ["Зүрх сэтгэл, мэдрэмж", "Ухаан, логик", "Тэвчээр, тогтвортой байдал", "Зоригтой байдал, хийх дур"],
  },
];

// ─── Result Generators ────────────────────────────────────────────────────────

function generateMoneyResult(day: number, month: number, year: number): ResultData {
  const lifeNumber = ((day + month + (year % 100)) % 9) + 1;
  const symbols = ["☽", "☿", "♀", "☉", "♂", "♃", "♄", "⟐", "✦"];
  const labels = ["Сарны код", "Мөнгөний эрч", "Хайрын хүч", "Нарны тавилан",
    "Галын зам", "Баяны гараг", "Тогтвортой байдал", "Нарийн ухаан", "Гэрэлт зам"];
  const descs = [
    "Та мөнгөтэй харилцаандаа сэтгэл хөдлөлөөр хандах хандлагатай. Зарцуулсан мөнгөнийхөө нэг хэсгийг тогтмол хадгалах дадал тань ирээдүйн тогтвортой байдлыг бий болгоно.",
    "Та хурдан шийдвэр гаргадаг бизнес сэтгэлгээтэй хүн. Шинэ боломжийг цаг тухайд нь олж авч чаддаг энэ чадвар тань санхүүгийн давуу тал болно.",
    "Та хүмүүстэй харилцах чадвараараа орлого олох боломжтой. Бусдад тусалснаар буцаж ирэх баялаг тань нэмэгдэх нь тодорхой байна.",
    "Та нарны тавилантай - удирдлага, бизнест байгалиасаа тохирсон. Энэ жил шинэ эх үүсвэр нээх хамгийн зохист цаг юм.",
    "Та зорьсон зүгтээ тэмүүлэх хүч чадалтай. Санхүүгийн хувьд эрсдэл хүлээж болно, гэвч хязгаарлагдмал байлгавал амжилт гарцаагүй ирнэ.",
    "Та баялагийн гарагтай - хөрөнгө оруулалт, удаан хугацааны хуримтлал тань сайн ажиллана. Тэвчээр бол таны хамгийн том хөрөнгө.",
    "Та санхүүдээ хатуу, тогтвортой хандлагатай. Аажим ч гэсэн найдвартай хуримтлал бий болгох чадвар тань урт хугацаанд их үр дүнд хүргэнэ.",
    "Та нарийн дүн шинжилгээ хийж чадна. Хөрөнгийн зах зээл, мэдлэгт суурилсан орлогын эх үүсвэр тань хамгийн сайн ажиллана.",
    "Та олон замаар орлого олох хувь тавилантай. Нэг ажилд хязгаарлагдалгүй, олон боломжийг нэгэн зэрэг ашиглаарай.",
  ];
  const idx = lifeNumber - 1;
  return {
    quizType: "money",
    symbol: symbols[idx],
    symbolLabel: labels[idx],
    headline: `МӨНГӨНИЙ КОД: ${lifeNumber}`,
    description: descs[idx],
    detail: `Таны ${year} онд мэндэлсэн нь ${lifeNumber}-р мөнгөний замд оруулдаг. ${month}-р сард төрсөн нь тань санхүүгийн оргил цагаа ${month < 7 ? "жилийн эхний хагаст" : "жилийн сүүлийн хагаст"} мэдрэх болно гэсэн үг.`,
    socialCount: 1247 + lifeNumber * 83,
  };
}

function generateNameResult(name: string): ResultData {
  const clean = name.trim();
  const vowelsArr = (clean.match(/[аэиоуөүёАЭИОУӨҮЁ]/g) || []);
  const vowels = vowelsArr.length;
  const total = clean.length;
  const ratio = vowels / Math.max(total, 1);
  const first = clean.charAt(0) || "";
  const last = clean.charAt(clean.length - 1) || "";
  const hasRepeat = /(.)\1/.test(clean.toLowerCase());

  // Derive a pattern key based on explicit checks so outputs vary meaningfully
  let pattern: string;
  if (total <= 3) pattern = "short";
  else if (hasRepeat) pattern = "steady";
  else if (/[аеёиоуүэөүёAEIOUY]/i.test(last)) pattern = "flow";
  else if (ratio > 0.55) pattern = "empath";
  else if (first && /[бвгджзклмнпрстфхцчшщ]/i.test(first)) pattern = "strong";
  else pattern = "balanced";

  // Templates keyed by pattern
  const templates: Record<string, { sym: string; label: string; headline: (n: string) => string; desc: (n: string) => string; detail: (n: string) => string }> = {
    short: {
      sym: "⚡",
      label: "Товч, хүчтэй",
      headline: (n) => `${n.toUpperCase()} — ТОВЧ БА ХҮЧТЭЙ`,
      desc: (n) => `Таны нэр богино боловч хурц цохилт шиг нөлөөтэй. Богино нэр үр дүнтэй байж, шууд нөлөөлдөг.`,
      detail: (n) => `Богино нэртэй хүмүүс хурдан шийдвэр гаргадаг. ${n.charAt(0).toUpperCase()} үсгээр эхлэх нь илүү танигдах чадварыг нэмдэг.`,
    },
    steady: {
      sym: "🛡️",
      label: "Тогтвортой",
      headline: (n) => `${n} — НАЙДВАРТАЙ БА ТУУШТАЙ`,
      desc: (n) => `Та давтагдсан авиа агуулсан нэртэй тул тууштай нэг зүүгээр явдаг шинжтэй. Энэ нь таны тэсвэр тэвчээрийг илтгэнэ.`,
      detail: (n) => `Давтагдсан үсэг нь таны тууштай, баргар чанарыг бэлгэдэнэ. Урт хугацааны харилцаа, ажлын төслүүдэд энэ таны давуу тал болно.`,
    },
    flow: {
      sym: "🌊",
      label: "Үргэлжлэх урсгал",
      headline: (n) => `${n} — ҮРГЭЛЖЛЭХ, ТӨГСӨГДӨХ`,
      desc: (n) => `Таны нэрийн төгсгөл нь авианаас шалтгаалж, урсгалтай, харилцаанд амархан нийцдэг. Энэ нь хүмүүсийг тайвшруулах чадвартай.`,
      detail: (n) => `Сүүл нь дуулаа эсвэл зөөлөн авиа агуулсан тул та бусадтай хурдан нийлж ажилладаг. Энэ онцлог нь багийн доторх түншлэлд их тусална.`,
    },
    empath: {
      sym: "💧",
      label: "Мэдрэмжтэй",
      headline: (n) => `${n} — МЭДРЭМЖ, УХАМСАРТАЙ`,
      desc: (n) => `Нэрэнд тань олон эгшиг буй тул та мэдрэмж ихтэй, бусдын хэрэгцээг сайн ойлгодог.`,
      detail: (n) => `Эгшгийн тоо их байх нь үгс, урлаг, харилцаанд аварга хүч өгдөг. Та хүмүүст эмпатитай хандах замаар олны хүндэтгэлийг хүлээх болно.`,
    },
    strong: {
      sym: "🔥",
      label: "Хүчтэй эхлэл",
      headline: (n) => `${n} — ХҮЧТЭЙ ЭХЛЭЛ`,
      desc: (n) => `Нэрээ эхэлдэг анхны үсэг нь тухайн хүний амжилтын эхлэлд нөлөөлөх бөгөөд таны анхны авиа хүчтэй, зоригтой байдлыг өгдөг.`,
      detail: (n) => `Эхний үсэг нь удирдах чадвар, зориг илтгэнэ. ${n.charAt(0).toUpperCase()} үзэгдэл нь хүмүүст итгэл төрүүлнэ.`,
    },
    balanced: {
      sym: "✦",
      label: "Тэнцвэртэй",
      headline: (n) => `${n} — ТЭНЦВЭР, ДУНД ЗАЙ`,
      desc: (n) => `Таны нэр нь тэнцвэртэй: мэдрэмж ба логик хоёрыг багтаасан. Та аливааг жигд хянаж чаддаг.`,
      detail: (n) => `Тэнцвэрт байдлын ачаар та олон дүрэмт хувилбаруудад амархан дасан зохицоно. Алхам бүрийг бодож хийдэг.`,
    },
  };

  const tpl = templates[pattern] || templates.balanced;

  return {
    quizType: "name",
    symbol: tpl.sym,
    symbolLabel: tpl.label,
    headline: tpl.headline(clean),
    description: tpl.desc(clean),
    detail: tpl.detail(clean),
    socialCount: 2318 + total * 127 + vowels * 31,
  };
}

function generateLifeResult(answers: number[]): ResultData {
  const sum = answers.reduce((a, b) => a + b, 0);
  const idx = sum % 5;
  const paths = [
    { sym: "🌙", label: "Сарны зам", desc: "Та дотоод ертөнцийн хүн. Гадаад дуу чимээний дунд тань хамгийн чухал ойлголтууд нам чимээнд л төрдөг. Таны амьдралын гол утга нь гүн ойлголт, бусдад тусламж.", detail: "Энэ долоо хоногт дотоод амгаланг олоход анхаарлаа хандуулаарай. Тань хамгийн их дэмжлэг шаардлагатай хүнтэйгээ утсаар ярь." },
    { sym: "☀️", label: "Нарны зам", desc: "Та хүмүүст гэрэл өгдөг хүн. Таны байгаа газар эрч хүч, баяр хөөр нэмэгддэг. Амьдралын гол дуудлага тань удирдах, урам зориг өгөх.", detail: "Танд ойрын хугацаанд шинэ хүмүүстэй уулзах боломж гарна. Нэг шинэ чиглэлд хуруугаа шумбуулж үзэх нь ашигтай." },
    { sym: "⭐", label: "Одны зам", desc: "Та өөрийн онцгой замтай. Хэн нэгний замыг дагахаас илүү өөрийн туршлагаас суралцана. Бүтээлч байдал, шинэчлэл таны сэтгэлийг тэжээнэ.", detail: "Одоогийн нөхцөл байдлаасаа айгаарай гэж санахгүй байгаарай — та туршилт хийхэд зориулагдсан хүн юм." },
    { sym: "🌿", label: "Газрын зам", desc: "Та бусдад баттай тулгуур болдог хүн. Таны найдвартай, тогтвортой байдал нь хайртай хүмүүстээ аюулгүй орчин бий болгодог. Энэ бол том зориулалт.", detail: "Энэ долоо хоногт өөртөө анхаарал хандуулах цаг гар. Та ихэвчлэн бусдад зориулдаг — өнөөдөр өөрийнхөө хэрэгцээг тавь." },
    { sym: "🔥", label: "Галын зам", desc: "Та дотроо их хүч нуугдуулсан. Хамгийн хэцүү үед хамгийн тод гэрэлтэх чадвар тань байгаа. Таны амьдралын гол тулаан бол дотоод хязгаараа тодорхойлох явдал.", detail: "Та одоо чухал шийдвэрийн босго дээр зогсож байна. Гал шиг хурдан шийд — ухарвал боломж алдагдана." },
  ];
  const p = paths[idx];
  return {
    quizType: "life",
    symbol: p.sym,
    symbolLabel: p.label,
    headline: `ТАНЫ ЗАМ: ${p.label.toUpperCase()}`,
    description: p.desc,
    detail: p.detail,
    socialCount: 3891 + sum * 47,
  };
}

// ─── Star Field ───────────────────────────────────────────────────────────────

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-200"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ─── Glowing Orb ─────────────────────────────────────────────────────────────

function GlowOrb({ symbol, size = 140 }: { symbol: string; size?: number }) {
  return (
    <div className="relative flex items-center justify-center mx-auto" style={{ width: size, height: size }}>
      {/* Outer glow rings */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%)",
          animation: "pulse-ring 3s ease-in-out infinite",
        }}
      />
      <div
        className="absolute inset-0 rounded-full border border-amber-400/20"
        style={{ transform: "scale(1.3)", animation: "pulse-ring 3s ease-in-out 0.5s infinite" }}
      />
      <div
        className="absolute inset-0 rounded-full border border-pink-400/15"
        style={{ transform: "scale(1.6)", animation: "pulse-ring 3s ease-in-out 1s infinite" }}
      />
      {/* Main orb */}
      <div
        className="relative flex items-center justify-center rounded-full border border-amber-400/40"
        style={{
          width: size,
          height: size,
          background:
            "radial-gradient(circle at 35% 35%, rgba(232,121,160,0.3), rgba(212,168,83,0.2), rgba(13,6,24,0.8))",
          boxShadow: "0 0 40px rgba(212,168,83,0.4), 0 0 80px rgba(232,121,160,0.2), inset 0 0 30px rgba(212,168,83,0.1)",
        }}
      >
        <span style={{ fontSize: size * 0.42, lineHeight: 1, filter: "drop-shadow(0 0 12px rgba(212,168,83,0.8))" }}>
          {symbol}
        </span>
      </div>
    </div>
  );
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────

function QuizCard({
  icon,
  title,
  subtitle,
  description,
  onClick,
  gradient,
}: {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: gradient,
        border: "1px solid rgba(212,168,83,0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,168,83,0.05)",
      }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)",
        }}
      />
      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-xl text-3xl"
            style={{
              width: 60,
              height: 60,
              background: "rgba(255,255,255,0.08)",
              boxShadow: "0 0 20px rgba(212,168,83,0.2)",
              filter: "drop-shadow(0 0 8px rgba(212,168,83,0.5))",
            }}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium tracking-widest text-amber-400/70 uppercase mb-0.5">
              {subtitle}
            </p>
            <h3
              className="text-xl font-bold leading-tight mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#f5e6d3" }}
            >
              {title}
            </h3>
            <p className="text-sm leading-relaxed text-purple-200/70">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            className="px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all"
            style={{
              background: "linear-gradient(135deg, #d4a853, #e879a0)",
              color: "#0d0618",
              boxShadow: "0 4px 15px rgba(212,168,83,0.3)",
            }}
          >
            Эхлэх →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Screens ──────────────────────────────────────────────────────────────────

function HomeScreen({ onStart, onAdminLogin, onProfile, userInfo }: { onStart: (quiz: QuizType) => void; onAdminLogin: () => void; onProfile: () => void; userInfo: UserInfo | null }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center overflow-hidden"
        style={{ minHeight: "55vh" }}
      >
        {/* Background gradient blobs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            width: 400,
            height: 300,
            background: "radial-gradient(ellipse, rgba(232,121,160,0.25) 0%, rgba(212,168,83,0.15) 50%, transparent 80%)",
            top: -40,
          }}
        />
        <div
          className="absolute bottom-0 left-1/4 rounded-full blur-3xl"
          style={{
            width: 250,
            height: 200,
            background: "radial-gradient(ellipse, rgba(139,74,107,0.3) 0%, transparent 70%)",
          }}
        />

        {/* Celestial decoration */}
        <div className="relative mb-6">
          <div className="text-5xl mb-2" style={{ filter: "drop-shadow(0 0 20px rgba(212,168,83,0.8))" }}>✦</div>
          <div className="flex items-center gap-6 text-2xl opacity-60">
            <span style={{ filter: "drop-shadow(0 0 8px rgba(212,168,83,0.6))" }}>☽</span>
            <span className="text-lg" style={{ filter: "drop-shadow(0 0 8px rgba(212,168,83,0.6))" }}>◦</span>
            <span style={{ filter: "drop-shadow(0 0 8px rgba(212,168,83,0.6))" }}>☉</span>
            <span className="text-lg" style={{ filter: "drop-shadow(0 0 8px rgba(212,168,83,0.6))" }}>◦</span>
            <span style={{ filter: "drop-shadow(0 0 8px rgba(212,168,83,0.6))" }}>✦</span>
          </div>
        </div>

        <div
          className="text-xs font-semibold tracking-[0.4em] uppercase mb-3"
          style={{ color: "#d4a853" }}
        >
          Монгол зурхай · Таамаглал
        </div>

        <h1
          className="text-4xl md:text-5xl font-black leading-tight mb-3"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: "linear-gradient(135deg, #f5e6d3 0%, #d4a853 40%, #e879a0 80%, #f5e6d3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 30px rgba(212,168,83,0.3))",
          }}
        >
          ТАВИЛАН
        </h1>

        <div
          className="text-lg md:text-xl font-medium mb-2"
          style={{ color: "#e8d5c4", fontFamily: "'Playfair Display', serif" }}
        >
          Таны хувь тавилан, амьдралын замыг илрүүлэх
        </div>

        <p className="text-sm text-purple-200/60 max-w-xs leading-relaxed">
          Төрсөн он, нэр, сэтгэлийн гүнд нуугдсан хувь тавилангаа илрүүл
        </p>

        {/* Divider */}
        <div className="mt-8 flex items-center gap-3 opacity-40">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #d4a853)" }} />
          <span className="text-amber-400 text-sm">✦</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #d4a853)" }} />
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="flex-1 px-4 pb-10 space-y-4 max-w-md mx-auto w-full">
        <p
          className="text-center text-xs tracking-widest uppercase mb-5"
          style={{ color: "#b89ab4" }}
        >
          Тест сонгох
        </p>

        <QuizCard
          icon="💰"
          title="МӨНГӨНИЙ КОД"
          subtitle="Төрсөн он сараар"
          description="Таны мэндэлсэн огноо мөнгөтэй харилцаа тань яагаад тийм байгааг тайлбарлаж байна"
          gradient="linear-gradient(135deg, #1a0e2e 0%, #2d1a0e 60%, #1f150a 100%)"
          onClick={() => onStart("money")}
        />

        <QuizCard
          icon="✨"
          title="НЭРНИЙ УТГА"
          subtitle="Нэрнийхээ нууцыг мэд"
          description="Таны нэрэнд нуугдсан онцгой шинж чанар, хувь тавилан руу чиглэсэн замыг тайлбарлана"
          gradient="linear-gradient(135deg, #1a0e2e 0%, #1a0e1f 60%, #150e2e 100%)"
          onClick={() => onStart("name")}
        />

        <QuizCard
          icon="🌌"
          title="АМЬДРАЛЫН ЗАМ"
          subtitle="5 асуулт · 2 минут"
          description="Танд зориулагдсан тусгай зам байдаг. 5 асуулт хариулж, өөрийн амьдралын чиглэлийг нээ"
          gradient="linear-gradient(135deg, #1a0e2e 0%, #0e1a2e 60%, #0d1518 100%)"
          onClick={() => onStart("life")}
        />

        {/* Footer */}
        <div className="pt-8 text-center space-y-4">
          <p className="text-xs text-purple-200/30">Өдөр бүр 4,200+ хүн шалгадаг</p>
          <div className="flex justify-center gap-1">
            {["★", "★", "★", "★", "★"].map((s, i) => (
              <span key={i} className="text-xs text-amber-400/60">{s}</span>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 mt-4 sm:flex-row sm:justify-center">
            <button
              onClick={onProfile}
              className="px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-colors border border-amber-400/30 hover:border-amber-400"
              style={{ color: '#f5e6d3' }}
            >
              {userInfo ? `Профайл: ${userInfo.name}` : 'Профайл бөглөх'}
            </button>
            <button
              onClick={onAdminLogin}
              className="px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-colors border border-purple-500/30 hover:border-purple-400"
              style={{ color: '#d4a853' }}
            >
              Админ нэвтрэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen({
  userInfo,
  onSave,
  onBack,
}: {
  userInfo: UserInfo | null;
  onSave: (user: UserInfo) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.email || "");
  const [age, setAge] = useState(userInfo?.age || "");
  const [gender, setGender] = useState<Gender>(userInfo?.gender || "male");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !age.trim()) {
      setError("Нэр, нас, Gmail-г оруулна уу");
      return;
    }
    if (!email.includes("@")) {
      setError("Зөв Gmail хаяг оруулна уу");
      return;
    }
    onSave({ name: name.trim(), email: email.trim(), age: age.trim(), gender });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center px-4 pt-12 pb-4">
        <button
          onClick={onBack}
          className="text-amber-400/70 text-sm flex items-center gap-2 hover:text-amber-400 transition-colors"
        >
          ← Буцах
        </button>
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3" style={{ filter: "drop-shadow(0 0 15px rgba(212,168,83,0.7))" }}>
            👤
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#d4a853" }}>
            Хувийн мэдээлэл
          </h2>
          <p className="text-sm text-purple-200/60">Нас, хүйс, Gmail-ээ өгнө үү</p>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(26,14,46,0.9)", border: "1px solid rgba(212,168,83,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div className="space-y-4">
            <label className="block text-xs text-amber-400/60 uppercase tracking-wider">Нэр</label>
            <input
              type="text"
              placeholder="Таны нэр"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className="w-full rounded-xl p-4 bg-slate-900 border border-slate-800 text-white"
            />

            <label className="block text-xs text-amber-400/60 uppercase tracking-wider">Gmail</label>
            <input
              type="email"
              placeholder="name@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full rounded-xl p-4 bg-slate-900 border border-slate-800 text-white"
            />

            <label className="block text-xs text-amber-400/60 uppercase tracking-wider">Нас</label>
            <input
              type="number"
              placeholder="25"
              value={age}
              min={10}
              max={120}
              onChange={(e) => { setAge(e.target.value); setError(""); }}
              className="w-full rounded-xl p-4 bg-slate-900 border border-slate-800 text-white"
            />

            <label className="block text-xs text-amber-400/60 uppercase tracking-wider">Хүйс</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full rounded-xl p-4 bg-slate-900 border border-slate-800 text-white"
            >
              <option value="male">Эр</option>
              <option value="female">Эм</option>
              <option value="other">Бусад</option>
            </select>

            {error && <p className="text-pink-400 text-sm">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #d4a853, #e879a0)", color: "#0d0618", boxShadow: "0 8px 25px rgba(212,168,83,0.4)" }}
            >
              Хадгалах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoneyInputScreen({
  onResult,
  onBack,
}: {
  onResult: (data: ResultData) => void;
  onBack: () => void;
}) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    if (!d || !m || !y || d < 1 || d > 31 || m < 1 || m > 12 || y < 1920 || y > 2015) {
      setError("Зөв огноо оруулна уу");
      return;
    }
    onResult(generateMoneyResult(d, m, y));
  };

  const inputStyle = {
    background: "rgba(45,26,62,0.8)",
    border: "1px solid rgba(212,168,83,0.3)",
    color: "#f5e6d3",
    borderRadius: 12,
    fontSize: 18,
    fontWeight: 600,
    textAlign: "center" as const,
    outline: "none",
    width: "100%",
    padding: "14px 8px",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={onBack} className="text-amber-400/70 text-sm flex items-center gap-2 hover:text-amber-400 transition-colors">
          ← Буцах
        </button>
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3" style={{ filter: "drop-shadow(0 0 15px rgba(212,168,83,0.7))" }}>💰</div>
          <h2
            className="text-2xl font-black mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "#d4a853" }}
          >
            МӨНГӨНИЙ КОД
          </h2>
          <p className="text-sm text-purple-200/60">Төрсөн огноогоо оруулна уу</p>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(26,14,46,0.9)",
            border: "1px solid rgba(212,168,83,0.2)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div>
              <label className="block text-xs text-amber-400/60 uppercase tracking-wider mb-2 text-center">Өдөр</label>
              <input
                type="number"
                placeholder="15"
                value={day}
                min={1}
                max={31}
                onChange={(e) => { setDay(e.target.value); setError(""); }}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-400/60 uppercase tracking-wider mb-2 text-center">Сар</label>
              <input
                type="number"
                placeholder="06"
                value={month}
                min={1}
                max={12}
                onChange={(e) => { setMonth(e.target.value); setError(""); }}
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-400/60 uppercase tracking-wider mb-2 text-center">Он</label>
              <input
                type="number"
                placeholder="1995"
                value={year}
                min={1920}
                max={2015}
                onChange={(e) => { setYear(e.target.value); setError(""); }}
                style={inputStyle}
              />
            </div>
          </div>

          {error && <p className="text-pink-400 text-sm text-center mb-4">{error}</p>}

          <div className="text-center text-xs text-purple-200/40 mb-4">
            Жишээ: 1990 оны 3-р сарын 15
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #d4a853, #c8956a, #e879a0)",
              color: "#0d0618",
              boxShadow: "0 8px 25px rgba(212,168,83,0.4)",
            }}
          >
            ✦ Мөнгөний кодыг тайлбарлах ✦
          </button>
        </div>

        <p className="text-center text-xs text-purple-200/30">
          Таны мэдээлэл хадгалагдахгүй
        </p>
      </div>
    </div>
  );
}

function NameInputScreen({
  onResult,
  onBack,
}: {
  onResult: (data: ResultData) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || name.trim().length < 2) return;
    onResult(generateNameResult(name.trim()));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center px-4 pt-12 pb-4">
        <button onClick={onBack} className="text-amber-400/70 text-sm flex items-center gap-2 hover:text-amber-400 transition-colors">
          ← Буцах
        </button>
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3" style={{ filter: "drop-shadow(0 0 15px rgba(232,121,160,0.7))" }}>✨</div>
          <h2
            className="text-2xl font-black mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "#e879a0" }}
          >
            НЭРНИЙ УТГА
          </h2>
          <p className="text-sm text-purple-200/60">Нэрэнд нуугдсан нууцыг нээ</p>
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: "rgba(26,14,46,0.9)",
            border: "1px solid rgba(232,121,160,0.25)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <label className="block text-xs text-pink-400/70 uppercase tracking-wider mb-3">
            Таны нэр
          </label>
          <input
            type="text"
            placeholder="Нэрээ бичнэ үү..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            maxLength={30}
            style={{
              background: "rgba(45,26,62,0.8)",
              border: "1px solid rgba(232,121,160,0.3)",
              color: "#f5e6d3",
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 600,
              outline: "none",
              width: "100%",
              padding: "16px 18px",
              marginBottom: 6,
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)",
            }}
          />
          <p className="text-right text-xs text-purple-200/30 mb-6">{name.length}/30</p>

          <button
            onClick={handleSubmit}
            disabled={name.trim().length < 2}
            className="w-full py-4 rounded-xl font-bold text-base tracking-wide transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #e879a0, #9b5de5, #d4a853)",
              color: "#0d0618",
              boxShadow: name.trim().length >= 2 ? "0 8px 25px rgba(232,121,160,0.4)" : "none",
            }}
          >
            ✦ Нэрийг тайлбарлах ✦
          </button>
        </div>

        <div
          className="rounded-xl p-4 text-center"
          style={{ background: "rgba(232,121,160,0.06)", border: "1px solid rgba(232,121,160,0.1)" }}
        >
          <p className="text-xs text-purple-200/50 leading-relaxed">
            Нэр бүр өөрийн гэсэн дайсны чанар агуулдаг. Монгол уламжлалт зурхайн дагуу нэрний авиа тань ирээдүйд нөлөөлнө.
          </p>
        </div>
      </div>
    </div>
  );
}

function LifeInputScreen({
  onResult,
  onBack,
}: {
  onResult: (data: ResultData) => void;
  onBack: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    if (step < lifeQuestions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      onResult(generateLifeResult(newAnswers));
    }
  };

  const progress = ((step) / lifeQuestions.length) * 100;
  const q = lifeQuestions[step];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={step === 0 ? onBack : () => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }}
          className="text-amber-400/70 text-sm hover:text-amber-400 transition-colors"
        >
          ← Буцах
        </button>
        <span className="text-xs text-purple-200/50">{step + 1} / {lifeQuestions.length}</span>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-8">
        <div className="h-1 rounded-full" style={{ background: "rgba(212,168,83,0.15)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right, #d4a853, #e879a0)" }}
            animate={{ width: `${progress + 20}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="text-3xl mb-4" style={{ filter: "drop-shadow(0 0 12px rgba(155,93,229,0.6))" }}>🌌</div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-xl font-bold leading-snug px-2"
              style={{ fontFamily: "'Playfair Display', serif", color: "#f5e6d3" }}
            >
              {q.question}
            </motion.h2>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {q.options.map((option, i) => (
              <motion.button
                key={i}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer(i)}
                className="w-full text-left px-5 py-4 rounded-xl transition-all"
                style={{
                  background: "rgba(26,14,46,0.9)",
                  border: "1px solid rgba(212,168,83,0.2)",
                  color: "#f5e6d3",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                }}
              >
                <span className="text-amber-400/50 text-sm mr-3">{String.fromCharCode(65 + i)}.</span>
                <span className="text-sm font-medium">{option}</span>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultScreen({
  data,
  onRestart,
  onHome,
  onPurchase,
}: {
  data: ResultData;
  onRestart: () => void;
  onHome: () => void;
  onPurchase: () => void;
}) {
  const [showPremium, setShowPremium] = useState(false);

  const accentColor = data.quizType === "money" ? "#d4a853" : data.quizType === "name" ? "#e879a0" : "#9b5de5";

  useEffect(() => {
    const t = setTimeout(() => setShowPremium(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button onClick={onHome} className="text-amber-400/70 text-sm hover:text-amber-400 transition-colors">
          ← Нүүр хуудас
        </button>
        <button onClick={onRestart} className="text-xs text-purple-200/50 hover:text-purple-200/80 transition-colors">
          Дахин шалгах
        </button>
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        {/* Congratulation header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <p
            className="text-xs font-semibold tracking-[0.35em] uppercase mb-2"
            style={{ color: accentColor }}
          >
            Таны үр дүн
          </p>
          <h2
            className="text-2xl font-black"
            style={{
              fontFamily: "'Playfair Display', serif",
              background: `linear-gradient(135deg, #f5e6d3, ${accentColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ТАНД БАЯР ХҮРГЭЕ!
          </h2>
        </motion.div>

        {/* Glowing orb result */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="mb-6"
        >
          <GlowOrb symbol={data.symbol} size={150} />
          <div className="text-center mt-4">
            <p
              className="text-base font-semibold tracking-wide"
              style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}
            >
              {data.symbolLabel}
            </p>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-4"
        >
          <h3
            className="text-lg font-black tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif", color: "#f5e6d3" }}
          >
            {data.headline}
          </h3>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="flex -space-x-1.5">
            {["🟠", "🔵", "🟣"].map((c, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full text-xs flex items-center justify-center border border-purple-900"
                style={{ background: "rgba(45,26,62,0.9)" }}
              >
                {c}
              </div>
            ))}
          </div>
          <span className="text-xs text-purple-200/50">
            Өнөөдөр <strong className="text-amber-400">{data.socialCount.toLocaleString()}</strong> хүн шалгалаа
          </span>
        </motion.div>

        {/* Description card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-5 mb-4"
          style={{
            background: "rgba(26,14,46,0.9)",
            border: `1px solid ${accentColor}30`,
            boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 0 1px ${accentColor}10`,
          }}
        >
          <p className="text-sm leading-relaxed text-purple-100/80 mb-4">{data.description}</p>
          <div
            className="h-px mb-4"
            style={{ background: `linear-gradient(to right, transparent, ${accentColor}40, transparent)` }}
          />
          <p className="text-xs leading-relaxed text-purple-200/50">{data.detail}</p>
        </motion.div>

        {/* Share buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            className="py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: "rgba(24,119,242,0.2)",
              border: "1px solid rgba(24,119,242,0.4)",
              color: "#7bb0f5",
            }}
          >
            <span>📘</span> Facebook
          </button>
          <button
            className="py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: "rgba(0,168,132,0.2)",
              border: "1px solid rgba(0,168,132,0.4)",
              color: "#5dd6b8",
            }}
          >
            <span>💬</span> Messenger
          </button>
        </motion.div>

        {/* Premium upsell */}
        <AnimatePresence>
          {showPremium && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(26,14,46,0.95) 0%, rgba(45,26,14,0.95) 100%)`,
                border: `1px solid ${accentColor}50`,
                boxShadow: `0 0 30px ${accentColor}20`,
              }}
            >
              {/* Premium header */}
              <div
                className="px-5 pt-5 pb-3"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}15, transparent)`,
                  borderBottom: `1px solid ${accentColor}20`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🔮</span>
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: accentColor }}
                  >
                    Дэлгэрэнгүй тайлбар
                  </span>
                </div>
                <h4
                  className="text-base font-black"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#f5e6d3" }}
                >
                  Энэ долоо хоногийн зөвлөгөө + Дэлгэрэнгүй шинжилгээ
                </h4>
              </div>

              <div className="px-5 py-4">
                <ul className="space-y-2 mb-5">
                  {[
                    "Долоо хоногийн хамгийн таатай өдөр, цаг",
                    "Таны тохирох өнгө, зүг чиг",
                    "Ирэх сарын санхүүгийн тавилан",
                    "Хамгийн тохирох хань, нөхрийн шинж",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-purple-200/70">
                      <span style={{ color: accentColor }}>✦</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="text-2xl font-black"
                      style={{ fontFamily: "'Playfair Display', serif", color: accentColor }}
                    >
                      12,000₮
                    </span>
                    <span className="text-xs text-purple-200/40 ml-2 line-through">22,000₮</span>
                  </div>
                  <button
                    onClick={onPurchase}
                    className="px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
                    style={{
                      background: `linear-gradient(135deg, ${accentColor}, #e879a0)`,
                      color: "#0d0618",
                      boxShadow: `0 6px 20px ${accentColor}40`,
                    }}
                  >
                    Авах →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Try other quizzes */}
        <div className="mt-6 text-center">
          <p className="text-xs text-purple-200/30 mb-3">Бусад тест туршиж үзэх</p>
          <button
            onClick={onHome}
            className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors underline underline-offset-2"
          >
            Бүх тестүүдийг харах
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminLoginScreen({
  onLogin,
  onBack,
}: {
  onLogin: (email: string, password: string) => boolean;
  onBack: () => void;
}) {
  const [email, setEmail] = useState("admin@viralquiz.mn");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const success = onLogin(email, password);
    if (!success) {
      setError("Имэйл эсвэл нууц үг буруу байна.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center px-4 pt-12 pb-4">
        <button
          onClick={onBack}
          className="text-amber-400/70 text-sm flex items-center gap-2 hover:text-amber-400 transition-colors"
        >
          ← Буцах
        </button>
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        <div className="text-center mb-10">
          <div className="text-4xl mb-3" style={{ filter: "drop-shadow(0 0 15px rgba(212,168,83,0.7))" }}>
            🔐
          </div>
          <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#d4a853" }}>
            Админ нэвтрэх
          </h2>
          <p className="text-sm text-purple-200/60">Зөвхөн админ хэрэглэгч нэвтрэх эрхтэй.</p>
        </div>

        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(26,14,46,0.9)", border: "1px solid rgba(212,168,83,0.2)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
          <div className="space-y-4">
            <label className="block text-xs text-amber-400/60 uppercase tracking-wider">Имэйл</label>
            <input
              type="email"
              placeholder="admin@viralquiz.mn"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className="w-full rounded-xl p-4 bg-slate-900 border border-slate-800 text-white"
            />

            <label className="block text-xs text-amber-400/60 uppercase tracking-wider">Нууц үг</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full rounded-xl p-4 bg-slate-900 border border-slate-800 text-white"
            />

            {error && <p className="text-xs text-pink-400">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-bold text-base tracking-wide"
              style={{ background: "linear-gradient(135deg, #d4a853, #e879a0)", color: "#0d0618" }}
            >
              Нэвтрэх
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentScreen({
  data,
  userInfo,
  onBack,
  onConfirm,
}: {
  data: ResultData;
  userInfo: UserInfo | null;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const accentColor = data.quizType === "money" ? "#d4a853" : data.quizType === "name" ? "#e879a0" : "#9b5de5";

  return (
    <motion.div
      className="min-h-screen flex flex-col pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center px-4 pt-12 pb-4">
        <button
          onClick={onBack}
          className="text-amber-400/70 text-sm flex items-center gap-2 hover:text-amber-400 transition-colors"
        >
          ← Буцах
        </button>
      </div>

      <div className="flex-1 px-5 max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div
            className="text-5xl mb-3"
            style={{ filter: "drop-shadow(0 0 18px rgba(212,168,83,0.7))" }}
          >
            💳
          </div>
          <h2
            className="text-3xl font-black mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: accentColor }}
          >
            Төлбөрийн хуудас
          </h2>
          <p className="text-sm text-purple-200/60">
            Та дэлгэрэнгүй тайлбарыг авахын тулд төлбөрөө баталгаажуулна.
          </p>
        </div>

        <motion.div
          className="rounded-3xl p-6 mb-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          whileHover={{ y: -3 }}
          style={{
            background: "rgba(26,14,46,0.95)",
            border: `1px solid ${accentColor}30`,
            boxShadow: `0 22px 72px rgba(0,0,0,0.45)`,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-24"
            style={{
              background: `radial-gradient(circle at top center, ${accentColor}25, transparent 45%)`,
              opacity: 0.55,
              filter: "blur(18px)",
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-purple-200/50 mb-2">Төрлийн үр дүн</p>
                <p className="text-lg font-semibold text-white">{data.headline}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-purple-200/40">Үнэ</p>
                <p
                  className="text-2xl font-black"
                  style={{ color: accentColor, fontFamily: "'Playfair Display', serif" }}
                >
                  12,000₮
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-purple-200/70 mb-6">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-amber-400">✦</span>
                <p>Долоо хоногийн хамгийн таатай өдөр, цаг.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-amber-400">✦</span>
                <p>Тохирох өнгө, зүг чиг.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-amber-400">✦</span>
                <p>Ирэх сарын санхүүгийн тавилан.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-amber-400">✦</span>
                <p>Хамгийн тохирох хань, нөхрийн шинж.</p>
              </div>
            </div>

            <motion.button
              onClick={onConfirm}
              disabled={!userInfo}
              whileHover={userInfo ? { scale: 1.02 } : undefined}
              whileTap={userInfo ? { scale: 0.98 } : undefined}
              className={`w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all ${userInfo ? "" : "opacity-50 cursor-not-allowed"}`}
              style={{
                background: userInfo ? `linear-gradient(135deg, ${accentColor}, #e879a0)` : "#4b5563",
                color: "#0d0618",
                boxShadow: userInfo ? `0 10px 25px ${accentColor}40` : "none",
              }}
            >
              {userInfo ? "Төлбөр төлөх" : "Профайл шаардлагатай"}
            </motion.button>
          </div>
        </motion.div>

        <div className="rounded-2xl p-5 text-xs text-purple-200/40 bg-white/5 border border-white/10">
          <p className="font-semibold text-purple-100 mb-2">Анхааруулга</p>
          <p className="leading-relaxed mb-3">
            Төлбөр баталгаажуулсны дараа таны Gmail хаягаар дэлгэрэнгүй тайлбар илгээгдэнэ. Тиймээс төлбөр хийхдээ заавал өөрийн Gmail хаягаа ашиглана уу.
          </p>
          {userInfo ? (
            <>
              <p className="leading-relaxed mb-3">
                Таны Gmail: <strong>{userInfo.email}</strong>
              </p>
              <p className="leading-relaxed">
                Төлбөрийн утга дээр заавал энэ Gmail хаягаа бичиж шилжүүлнэ үү.
              </p>
            </>
          ) : (
            <p className="leading-relaxed mb-3 text-pink-400">
              Та эхлээд профайлаа бүртгэж, Gmail-ээ оруулна уу.
            </p>
          )}
          <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3">
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300/80 mb-2">Хүлээн авах данс</p>
            <p className="text-sm font-semibold text-amber-300">Khan Bank</p>
            <p className="text-lg font-black text-white">5404840683</p>
            <p className="mt-2 text-[11px] leading-relaxed text-purple-200/70">
              Төлбөр хийсний дараа төлбөрийн утга дээр Gmail хаягаа заавал бичнэ үү. Үгүй бол таны уншлага хүлээлгэж магадгүй.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AdminScreen({
  entryCount,
  paymentPageViews,
  paymentClicks,
  submissions,
  onLogout,
}: {
  entryCount: number;
  paymentPageViews: number;
  paymentClicks: number;
  submissions: Submission[];
  onLogout: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col pb-6">
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <button
          onClick={onLogout}
          className="text-amber-400/70 text-sm flex items-center gap-2 hover:text-amber-400 transition-colors"
        >
          ← Буцах
        </button>
        <button
          onClick={onLogout}
          className="text-purple-200/70 text-sm rounded-full px-3 py-2 border border-purple-500/20 hover:border-purple-400 hover:text-purple-100 transition-colors"
        >
          Гарах
        </button>
      </div>

      <div className="flex-1 px-5 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3" style={{ filter: "drop-shadow(0 0 18px rgba(212,168,83,0.7))" }}>🛡️</div>
          <h2
            className="text-3xl font-black mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: "#d4a853" }}
          >
            Админ самбар
          </h2>
          <p className="text-sm text-purple-200/60">
            Хэдэн хүн орж, хэдэн хүн төлбөр төлөх товч даравыг харна.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Нийт оролт",
              value: entryCount,
              desc: "Тестийн үр дүн харахаар орсон хэрэглэгчийн тоо.",
            },
            {
              label: "Төлбөрийн хуудас",
              value: paymentPageViews,
              desc: "Төлбөрийн хуудас руу орсон тоо.",
            },
            {
              label: "Төлбөр баталгаажуулсан",
              value: paymentClicks,
              desc: "Төлбөр төлөх товч дарсан тоо.",
            },
          ].map((card) => (
            <motion.div
              key={card.label}
              whileHover={{ y: -6 }}
              className="rounded-3xl p-6 bg-slate-950/90 border border-amber-400/10 shadow-[0_20px_60px_rgba(212,168,83,0.1)]"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-purple-200/40 mb-3">{card.label}</p>
              <p className="text-4xl font-black text-amber-300 mb-3">{card.value}</p>
              <p className="text-xs leading-relaxed text-purple-200/60">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl p-6 bg-gradient-to-r from-violet-950 via-slate-950 to-fuchsia-950 border border-white/10 shadow-[0_20px_80px_rgba(148,163,184,0.1)]">
          <div className="text-xs uppercase tracking-[0.35em] text-purple-200/40 mb-3">Тайлбар</div>
          <p className="text-sm leading-relaxed text-purple-200/70">
            Энэ самбар нь демо зориулалттай бөгөөд таны орж ирсэн хэрэглэгчийн тоо болон төлбөрийн товч дарагдсаныг харна. Төлбөр баталгаажуулах бол бодит төлбөрийн гүйцэтгэл шаардлагатай.
          </p>
        </div>

        <div className="mt-8 rounded-3xl p-6 bg-slate-950/95 border border-amber-400/10 shadow-[0_30px_80px_rgba(212,168,83,0.08)]">
          <div className="text-sm font-semibold text-amber-300 mb-4">Оруулсан мэдээлэл</div>
          {submissions.length === 0 ? (
            <p className="text-sm text-purple-200/60">Одоогоор бүртгэлтэй хэрэглэгч байхгүй.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="text-xs uppercase text-purple-200/60">
                    <th className="pb-3 pr-3">Огноо</th>
                    <th className="pb-3 pr-3">Нэр</th>
                    <th className="pb-3 pr-3">Gmail</th>
                    <th className="pb-3 pr-3">Нас</th>
                    <th className="pb-3 pr-3">Хүйс</th>
                    <th className="pb-3 pr-3">Тест</th>
                    <th className="pb-3 pr-3">Төлөв</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((item) => (
                    <tr key={item.id} className="border-t border-white/10">
                      <td className="py-3 pr-3 text-xs text-purple-200/50">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-3 text-sm text-purple-100">{item.name}</td>
                      <td className="py-3 pr-3 text-sm text-purple-100">{item.email}</td>
                      <td className="py-3 pr-3 text-sm text-purple-100">{item.age}</td>
                      <td className="py-3 pr-3 text-sm text-purple-100">{item.gender}</td>
                      <td className="py-3 pr-3 text-sm text-purple-100">{item.quizType}</td>
                      <td className="py-3 pr-3 text-sm text-amber-300">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentConfirmationScreen({
  data,
  onDone,
}: {
  data: ResultData;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDone(), 6000);
    return () => clearTimeout(t);
  }, [onDone]);

  const accentColor = data.quizType === "money" ? "#d4a853" : data.quizType === "name" ? "#e879a0" : "#9b5de5";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl p-6 max-w-md w-full text-center"
        style={{ background: "rgba(26,14,46,0.95)", border: `1px solid ${accentColor}30` }}
      >
        <div className="text-5xl mb-3" style={{ color: accentColor }}>✅</div>
        <h3 className="text-xl font-bold mb-2" style={{ color: "#f5e6d3" }}>
          Төлбөр хүлээн авлаа
        </h3>
        <p className="text-sm text-purple-200/60 mb-4">
          Бид таны шилжүүлгийг шалгаж, төлбөрийн утга дээр бичсэн Gmail хаяг руу таны уншлагыг илгээх болно.
        </p>
        <p className="text-xs text-purple-200/40 mb-6">Та автомат илгээхийг хүлээн авахын тулд 1–2 ажлын хоног хүлээнэ үү.</p>

        <button
          onClick={onDone}
          className="px-6 py-3 rounded-xl font-bold"
          style={{ background: `linear-gradient(135deg, ${accentColor}, #e879a0)`, color: "#0d0618" }}
        >
          Нүүр рүү буцах
        </button>
      </motion.div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [activeQuiz, setActiveQuiz] = useState<QuizType>("money");
  const [result, setResult] = useState<ResultData | null>(null);
  const [entryCount, setEntryCount] = useState(0);
  const [paymentPageViews, setPaymentPageViews] = useState(0);
  const [paymentClicks, setPaymentClicks] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [pendingQuiz, setPendingQuiz] = useState<QuizType | null>(null);
  const [isAdminAuthenticated, setAdminAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const handleSaveProfile = (user: UserInfo) => {
    setUserInfo(user);
    if (pendingQuiz) {
      const nextQuiz = pendingQuiz;
      setPendingQuiz(null);
      setScreen(`${nextQuiz}-input` as Screen);
      return;
    }
    setScreen("home");
  };

  const handleStart = (quiz: QuizType) => {
    setActiveQuiz(quiz);
    if (!userInfo) {
      setPendingQuiz(quiz);
      setScreen("profile");
      return;
    }
    setScreen(`${quiz}-input` as Screen);
  };

  const handleOpenPayment = () => {
    setPaymentPageViews((value) => value + 1);
    setScreen("payment");
  };

  const handleOpenAdminLogin = () => {
    setScreen("admin-login");
  };

  const handleAdminLogin = (email: string, password: string) => {
    const isValid = email.trim().toLowerCase() === "admin@viralquiz.mn" && password === "ViralQuiz2026!";
    if (isValid) {
      setAdminAuthenticated(true);
      setScreen("admin");
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setScreen("home");
  };

  const handleConfirmPayment = () => {
    setPaymentClicks((count) => count + 1);
    if (result && userInfo) {
      const submission: Submission = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: userInfo.name,
        email: userInfo.email,
        age: userInfo.age,
        gender: userInfo.gender,
        quizType: result.quizType,
        headline: result.headline,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setSubmissions((prev) => [submission, ...prev]);
    }
    setScreen("payment-confirmation");
  };

  const handleOpenAdmin = () => {
    setScreen("admin");
  };

  const handleResult = (data: ResultData) => {
    setResult(data);
    setEntryCount((c) => c + 1);
    setScreen("result");
  };

  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.4); }
        }
        @keyframes pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        body { scrollbar-width: none; }
      `}</style>

      <div
        className="relative min-h-screen"
        style={{
          background: "linear-gradient(180deg, #0d0618 0%, #120820 40%, #0e0d18 100%)",
          fontFamily: "'Noto Sans', sans-serif",
        }}
      >
        <StarField />

        {/* Ambient glow */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(139,74,107,0.12) 0%, transparent 60%)",
            zIndex: 0,
          }}
        />

        <div className="relative" style={{ zIndex: 1 }}>
          <AnimatePresence mode="wait">
            {screen === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <HomeScreen onStart={handleStart} onAdminLogin={handleOpenAdminLogin} onProfile={() => setScreen("profile")} userInfo={userInfo} />
              </motion.div>
            )}

            {screen === "money-input" && (
              <motion.div
                key="money-input"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <MoneyInputScreen onResult={handleResult} onBack={() => setScreen("home")} />
              </motion.div>
            )}

            {screen === "name-input" && (
              <motion.div
                key="name-input"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <NameInputScreen onResult={handleResult} onBack={() => setScreen("home")} />
              </motion.div>
            )}

            {screen === "life-input" && (
              <motion.div
                key="life-input"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <LifeInputScreen onResult={handleResult} onBack={() => setScreen("home")} />
              </motion.div>
            )}

            {screen === "result" && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ResultScreen
                  data={result}
                  onRestart={() => setScreen(`${activeQuiz}-input` as Screen)}
                  onHome={() => setScreen("home")}
                  onPurchase={handleOpenPayment}
                />
              </motion.div>
            )}

            {screen === "payment" && result && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PaymentScreen
                  data={result}
                  userInfo={userInfo}
                  onBack={() => setScreen("result")}
                  onConfirm={handleConfirmPayment}
                />
              </motion.div>
            )}
            {screen === "payment-confirmation" && result && (
              <motion.div
                key="payment-confirmation"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <PaymentConfirmationScreen data={result} onDone={() => setScreen("home")} />
              </motion.div>
            )}

            {screen === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ProfileScreen
                  userInfo={userInfo}
                  onSave={handleSaveProfile}
                  onBack={() => setScreen("home")}
                />
              </motion.div>
            )}
            {screen === "admin-login" && (
              <motion.div
                key="admin-login"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AdminLoginScreen
                  onLogin={handleAdminLogin}
                  onBack={() => setScreen("home")}
                />
              </motion.div>
            )}
            {screen === "admin" && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <AdminScreen
                  entryCount={entryCount}
                  paymentPageViews={paymentPageViews}
                  paymentClicks={paymentClicks}
                  submissions={submissions}
                  onLogout={handleAdminLogout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
