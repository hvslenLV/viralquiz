import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = "home" | "money-input" | "name-input" | "life-input" | "result" | "payment" | "admin" | "payment-confirmation";

type QuizType = "money" | "name" | "life";

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
  const vowels = (name.match(/[аэиоуөүёАЭИОУӨҮЁ]/g) || []).length;
  const total = name.length;
  const ratio = vowels / Math.max(total, 1);
  const idx = Math.min(Math.floor(ratio * 5), 4);
  const archetypes = [
    { sym: "🜂", label: "Галын шинж", desc: "Таны нэрний дайсны нь хүч чадал, тэмүүлэлийг илэрхийлдэг. Та зорилгодоо хүрэхийн тулд ямар ч бэрхшээлийг даван туулдаг. Удирдагчийн шинж чанар таны нэрэнд нуугдаж байна.", detail: "Таны нэрний эхний үсэг нь галын нийлбэрт орох бөгөөд та найз нөхдийнхөө дотор байгалиасаа удирдагч болдог." },
    { sym: "🜄", label: "Усны шинж", desc: "Таны нэр гүн мэдрэмжийг нуугдуулдаг. Та хүмүүсийн зүрх сэтгэлийг уншиж, тэдний хэрэгцээг ойлгодог. Эмпати, бүтээлч сэтгэлгээ таны хамгийн том хүч.", detail: "Усны шинжтэй хүмүүс урлаг, хүмүүн хоорондын харилцаанд сайн. Таны зориулалт бол бусдад үзэгдэхгүй дэмжлэг болох явдал юм." },
    { sym: "🜁", label: "Агаарын шинж", desc: "Таны нэрэнд эрх чөлөө, бодлын эрх чөлөөний эрч нуугддаг. Та шинэ санаануудыг хурдан олж авдаг, нийгэмчилгэнд гайхалтай.", detail: "Агаарын шинжтэй хүн хичнээн ч орчинд дасан зохицох чадвартай. Та харилцаа холбоо, санаа бодлоор дамжуулан амжилтанд хүрнэ." },
    { sym: "🜃", label: "Газрын шинж", desc: "Таны нэрний гүн утга нь тогтвортой байдал, найдвартай байдлыг илэрхийлдэг. Та амласнаа биелүүлдэг, хариуцлагатай хүн. Бусад тань танд найддаг.", detail: "Газрын шинжтэй хүмүүс удаан хугацааны харилцаа, хамтын ажиллагааг эрхэмлэдэг. Таны нэр найдвартай байдлын тэмдэг юм." },
    { sym: "✦", label: "Одны шинж", desc: "Таны нэрэнд ховор, онцгой энерги байна. Та өөртөө итгэлтэй, бусдаас ялгардаг. Заяасан зам тань их гэрэлтэй, харин тэгш биш байна.", detail: "Одны шинжтэй хүмүүс өөрийн замаар явдаг. Хүмүүс тантай ойр болохыг хүсдэг ч та тодорхой зайг барьдаг — энэ таны хамгаалалт." },
  ];
  const a = archetypes[idx];
  return {
    quizType: "name",
    symbol: a.sym,
    symbolLabel: a.label,
    headline: `"${name.toUpperCase()}" — ${a.label.toUpperCase()}`,
    description: a.desc,
    detail: a.detail,
    socialCount: 2318 + name.length * 127,
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

function HomeScreen({ onStart, onAdmin }: { onStart: (quiz: QuizType) => void; onAdmin: () => void }) {
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
          ТАНЫ ТАВИЛАНГ ОЛЖМЭД
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
        <div className="pt-8 text-center space-y-1">
          <p className="text-xs text-purple-200/30">Өдөр бүр 4,200+ хүн шалгадаг</p>
          <div className="flex justify-center gap-1">
            {["★", "★", "★", "★", "★"].map((s, i) => (
              <span key={i} className="text-xs text-amber-400/60">{s}</span>
            ))}
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

function PaymentScreen({
  data,
  onBack,
  onConfirm,
}: {
  data: ResultData;
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, #e879a0)`,
                color: "#0d0618",
                boxShadow: `0 10px 25px ${accentColor}40`,
              }}
            >
              Төлбөр төлөх
            </motion.button>
          </div>
        </motion.div>

        <div className="rounded-2xl p-5 text-xs text-purple-200/40 bg-white/5 border border-white/10">
          <p className="font-semibold text-purple-100 mb-2">Анхааруулга</p>
          <p className="leading-relaxed mb-3">
            Энэ бол дизайн дээр суурилсан төлбөрийн хуудас. Байнгын төлбөр, банкны мэдээлэл эсвэл Gmail илгээх үйлчилгээг эндээс шууд гүйцэтгэх боломжгүй.
          </p>
          <p className="leading-relaxed">
            Төлбөрийн утга дээр өөрийн Gmail хаягаа бичиж, доорх данс руу шилжүүлнэ үү:
          </p>
          <p className="mt-3 font-semibold text-amber-300">
            Khan Bank данс: 5404840683
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function AdminScreen({
  entryCount,
  paymentPageViews,
  paymentClicks,
  onClose,
}: {
  entryCount: number;
  paymentPageViews: number;
  paymentClicks: number;
  onClose: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col pb-6">
      <div className="flex items-center px-4 pt-12 pb-4">
        <button
          onClick={onClose}
          className="text-amber-400/70 text-sm flex items-center gap-2 hover:text-amber-400 transition-colors"
        >
          ← Буцах
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

  const handleStart = (quiz: QuizType) => {
    setActiveQuiz(quiz);
    setScreen(`${quiz}-input` as Screen);
  };

  const handleOpenPayment = () => {
    setPaymentPageViews((value) => value + 1);
    setScreen("payment");
  };

  const handleConfirmPayment = () => {
    setPaymentClicks((count) => count + 1);
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
                <HomeScreen onStart={handleStart} onAdmin={handleOpenAdmin} />
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
                  onClose={() => setScreen("home")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
