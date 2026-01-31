export interface MorphokineticStage {
  name: string
  fullName?: string
  description?: string
  phase?: string
  startFrame: number
  endFrame: number
  color: string
  timestamp?: string
}

export interface MorphokineticDataset {
  id: string
  label: string
  maxFrames: number
  stages: MorphokineticStage[]
}

export const STAGE_DETAILS: Record<string, { id: number; name: string; description: string; phase: string; period_label?: string }> = {
  tPB2: {
    id: 12,
    name: "Second polar body appearance",
    description: "Thời điểm xuất hiện hoặc tách ra của thể cực thứ hai",
    phase: "Giai đoạn thụ tinh và tiền nhân",
  },
  tPNa: {
    id: 13,
    name: "Pronuclei appearance",
    description: "Thời điểm xuất hiện các tiền nhân",
    phase: "Giai đoạn thụ tinh và tiền nhân",
  },
  tPNf: {
    id: 14,
    name: "Pronuclei disappearance",
    description: "Thời điểm biến mất các tiền nhân (tan biến tiền nhân), báo hiệu sự bắt đầu của quá trình phân chia tế bào đầu tiên",
    phase: "Giai đoạn thụ tinh và tiền nhân",
  },
  t2: {
    id: 0,
    name: "2-cell stage",
    description: "Thời điểm phôi phân chia thành 2 tế bào (phôi bào)",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p2",
  },
  t3: {
    id: 1,
    name: "3-cell stage",
    description: "Thời điểm phôi phân chia thành 3 tế bào",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p3",
  },
  t4: {
    id: 2,
    name: "4-cell stage",
    description: "Thời điểm phôi phân chia thành 4 tế bào",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p4",
  },
  t5: {
    id: 3,
    name: "5-cell stage",
    description: "Thời điểm phôi phân chia thành 5 tế bào",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p5",
  },
  t6: {
    id: 4,
    name: "6-cell stage",
    description: "Thời điểm phôi phân chia thành 6 tế bào",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p6",
  },
  t7: {
    id: 5,
    name: "7-cell stage",
    description: "Thời điểm phôi phân chia thành 7 tế bào",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p7",
  },
  t8: {
    id: 6,
    name: "8-cell stage",
    description: "Thời điểm phôi phân chia thành 8 tế bào",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p8",
  },
  "t9+": {
    id: 7,
    name: "9+ cell stage",
    description: "Thời điểm phôi phân chia thành 9 tế bào hoặc nhiều hơn",
    phase: "Giai đoạn phân chia phôi bào (Cleavage)",
    period_label: "p9+",
  },
  tM: {
    id: 11,
    name: "Morula (Compaction)",
    description: "Thời điểm kết thúc quá trình nén (phôi dâu/morula), khi các tế bào liên kết chặt chẽ với nhau",
    phase: "Giai đoạn phôi dâu và phôi nang (Morula & Blastocyst)",
  },
  tSB: {
    id: 15,
    name: "Start of blastulation",
    description: "Thời điểm bắt đầu quá trình tạo khoang (tạo nang)",
    phase: "Giai đoạn phôi dâu và phôi nang (Morula & Blastocyst)",
  },
  tB: {
    id: 8,
    name: "Full blastocyst",
    description: "Thời điểm hình thành phôi nang đầy đủ",
    phase: "Giai đoạn phôi dâu và phôi nang (Morula & Blastocyst)",
  },
  tEB: {
    id: 9,
    name: "Expanded blastocyst",
    description: "Thời điểm phôi nang mở rộng kích thước",
    phase: "Giai đoạn phôi dâu và phôi nang (Morula & Blastocyst)",
  },
  tHB: {
    id: 10,
    name: "Hatching blastocyst",
    description: "Thời điểm phôi nang thoát màng (thoát khỏi màng zona pellucida)",
    phase: "Giai đoạn phôi dâu và phôi nang (Morula & Blastocyst)",
  },
}

export const MORPHOKINETIC_DATASETS: MorphokineticDataset[] = [
  {
    id: "type1",
    label: "Type 1",
    maxFrames: 353,
    stages: [
      { name: "tPB2", startFrame: 12, endFrame: 21, color: "#ef4444" },
      { name: "tPNa", startFrame: 22, endFrame: 106, color: "#f97316" },
      { name: "t2", startFrame: 107, endFrame: 148, color: "#eab308" },
      { name: "t3", startFrame: 149, endFrame: 150, color: "#22c55e" },
      { name: "t4", startFrame: 151, endFrame: 193, color: "#06b6d4" },
      { name: "t5", startFrame: 194, endFrame: 197, color: "#3b82f6" },
      { name: "t6", startFrame: 198, endFrame: 199, color: "#8b5cf6" },
      { name: "t7", startFrame: 200, endFrame: 203, color: "#d946ef" },
      { name: "t8", startFrame: 204, endFrame: 265, color: "#ec4899" },
      { name: "t9+", startFrame: 266, endFrame: 352, color: "#84cc16" },
    ],
  },
  {
    id: "type2",
    label: "Type 2",
    maxFrames: 362,
    stages: [
      { name: "tPB2", startFrame: 15, endFrame: 30, color: "#ef4444" },
      { name: "tPNa", startFrame: 31, endFrame: 95, color: "#f97316" },
      { name: "tPNf", startFrame: 96, endFrame: 105, color: "#fbbf24" },
      { name: "t2", startFrame: 106, endFrame: 153, color: "#eab308" },
      { name: "t3", startFrame: 154, endFrame: 157, color: "#22c55e" },
      { name: "t4", startFrame: 158, endFrame: 203, color: "#06b6d4" },
      { name: "t5", startFrame: 204, endFrame: 205, color: "#3b82f6" },
      { name: "t6", startFrame: 206, endFrame: 225, color: "#8b5cf6" },
      { name: "t8", startFrame: 226, endFrame: 289, color: "#ec4899" },
      { name: "t9+", startFrame: 290, endFrame: 361, color: "#84cc16" },
    ],
  },
  {
    id: "type3",
    label: "Type 3",
    maxFrames: 418,
    stages: [
      { name: "tPB2", startFrame: 20, endFrame: 31, color: "#ef4444" },
      { name: "tPNa", startFrame: 32, endFrame: 103, color: "#f97316" },
      { name: "tPNf", startFrame: 104, endFrame: 117, color: "#fbbf24" },
      { name: "t2", startFrame: 118, endFrame: 165, color: "#eab308" },
      { name: "t3", startFrame: 166, endFrame: 171, color: "#22c55e" },
      { name: "t4", startFrame: 172, endFrame: 237, color: "#06b6d4" },
      { name: "t8", startFrame: 238, endFrame: 326, color: "#ec4899" },
      { name: "t9+", startFrame: 327, endFrame: 417, color: "#84cc16" },
    ],
  },
]

// Default export for backward compatibility
export const MORPHOKINETIC_STAGES = MORPHOKINETIC_DATASETS[0].stages
