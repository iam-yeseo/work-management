/* ===== 나라장터 입찰 현황 =====
   업무 스케줄(tasks)과 분리된 별도 데이터입니다.
   CSV(나라장터 입찰용)에서 가져온 정적 목록이며 Supabase에 저장되지 않습니다. */
window.WM = window.WM || {};

WM.NARA_BIDS = [
  { date: "2026년 6월 4일", title: "아발랑쉬아파트 101동 옥상방수공사", agency: "아발랑쉬건설", baseAmount: 1000000000, bidAmount: 1000000000, result: "낙찰", awardAmount: 1000000000, followup: "", note: "" },
  { date: "2026년 6월 4일", title: "서울흑석초등학교 교사동 내부도장공사", agency: "서울특별시교육청 서울특별시동작관악교육지원청", baseAmount: 188123000, bidAmount: 170260970, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 4일", title: "삼성고등학교 교사동 방수공사", agency: "서울특별시교육청 서울특별시동작관악교육지원청", baseAmount: 169858000, bidAmount: 153672310, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 4일", title: "(긴급)시설공사 입찰 공고 (신영초 본관동 및 서관동 옥상방수공사)", agency: "서울특별시교육청 서울특별시남부교육지원청", baseAmount: 342840000, bidAmount: 310556990, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 4일", title: "정덕초 교사동 방수공사(신기술 특허공법)", agency: "서울특별시교육청 서울특별시성북강북교육지원청", baseAmount: 248525000, bidAmount: 224574340, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 4일", title: "26-F-우주마루아파트 외벽보수 및 도장공사(4008)", agency: "국방부", baseAmount: 333086190, bidAmount: 302965920, result: "", awardAmount: null, followup: "입찰 참가신청서 작성 완료", note: "" },
  { date: "2026년 6월 2일", title: "서울문창초등학교 본관 및 후관동 옥상방수공사", agency: "동작관악교육지원청", baseAmount: 70994000, bidAmount: 63844680, result: "낙찰", awardAmount: 63844680, followup: "결격심사 서류 제출", note: "" },
  { date: "2026년 6월 23일", title: "잠실고 교사동 내부 도장공사", agency: "서울특별시교육청 서울특별시강동송파교육지원청", baseAmount: 208171000, bidAmount: 188136380, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 23일", title: "7기동단 단본부 가연성 외장재 교체공사", agency: "경찰청 서울특별시경찰청 기동단 7기동대", baseAmount: 633830000, bidAmount: 574244900, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 23일", title: "시설공사 2인이상 견적 제출 수의계약 안내 공고(개봉중 포장 개선공사)", agency: "서울특별시교육청 서울특별시남부교육지원청", baseAmount: 82000000, bidAmount: 73360630, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 23일", title: "시설공사 2인이상 견적 제출 수의계약 안내 공고(구일중학교 포장 개선공사)", agency: "서울특별시교육청 서울특별시남부교육지원청", baseAmount: 152100000, bidAmount: 137744130, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 23일", title: "대진여고 교사동2(신념관) 옥상방수공사", agency: "서울특별시교육청 대진여자고등학교", baseAmount: 103880000, bidAmount: 93072730, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 23일", title: "서울남천초 교사동 내부 도장공사", agency: "서울특별시교육청 서울특별시강동송파교육지원청", baseAmount: 186892000, bidAmount: 167113360, result: "", awardAmount: null, followup: "", note: "" },
  { date: "2026년 6월 23일", title: "서울시립대학교 학생회관 3층 옥상 등 방수공사", agency: "서울특별시 서울시립대학교", baseAmount: 161584000, bidAmount: 144420400, result: "", awardAmount: null, followup: "", note: "" }
];

/** 요약 통계 (대시보드/페이지 공용) */
WM.naraStats = function () {
  var bids = WM.NARA_BIDS;
  var won = bids.filter(function (b) { return b.result === "낙찰"; });
  var pending = bids.filter(function (b) { return !b.result; });
  var followup = bids.filter(function (b) { return b.followup; });
  return {
    total: bids.length,
    won: won.length,
    pending: pending.length,
    followup: followup.length,
    awardTotal: won.reduce(function (s, b) { return s + (b.awardAmount || 0); }, 0)
  };
};

/** 결과 배지 */
function naraResultBadge(result) {
  if (result === "낙찰") return '<span class="badge b-plain-green">낙찰</span>';
  if (result === "유찰" || result === "패찰") return '<span class="badge b-plain-red">' + WM.esc(result) + "</span>";
  if (result) return '<span class="badge b-plain-amber">' + WM.esc(result) + "</span>";
  return '<span class="badge b-plain-gray">진행중</span>';
}

/** 나라장터 페이지 (별도 탭) */
WM.renderNarajangteo = function () {
  var bids = WM.NARA_BIDS;
  var st = WM.naraStats();

  var summary = '<div class="summary-grid">' +
    '<div class="card summary-card accent"><p class="s-label">' + WM.icon("gavel", 15) + '전체 공고</p><p class="s-count">' + st.total + '</p><p class="s-desc">등록된 입찰 공고 수</p></div>' +
    '<div class="card summary-card"><p class="s-label">' + WM.icon("checkcircle", 15) + '낙찰</p><p class="s-count">' + st.won + '</p><p class="s-desc">낙찰 확정 건수</p></div>' +
    '<div class="card summary-card"><p class="s-label">' + WM.icon("loader", 15) + '진행중</p><p class="s-count">' + st.pending + '</p><p class="s-desc">결과 미정 공고</p></div>' +
    '<div class="card summary-card"><p class="s-label">' + WM.icon("listchecks", 15) + '후속업무</p><p class="s-count">' + st.followup + '</p><p class="s-desc">후속 처리 표기 건</p></div>' +
    "</div>";

  var rows = bids.map(function (b) {
    return "<tr>" +
      '<td class="small">' + WM.esc(b.date) + "</td>" +
      '<td><p class="t-title">' + WM.esc(b.title) + "</p>" +
        (b.note ? '<p class="t-sub">' + WM.esc(b.note) + "</p>" : "") + "</td>" +
      '<td class="small">' + WM.esc(b.agency) + "</td>" +
      '<td class="right small">' + (b.baseAmount != null ? WM.formatAmount(b.baseAmount) : "-") + "</td>" +
      '<td class="right small">' + (b.bidAmount != null ? WM.formatAmount(b.bidAmount) : "-") + "</td>" +
      "<td>" + naraResultBadge(b.result) + "</td>" +
      '<td class="right small">' + (b.awardAmount != null ? WM.formatAmount(b.awardAmount) : "-") + "</td>" +
      '<td class="small">' + (b.followup ? WM.esc(b.followup) : "-") + "</td>" +
    "</tr>";
  }).join("");

  var table = '<div class="card table-wrap"><table class="task-table nara-table"><thead><tr>' +
    "<th>진행일</th><th>공고명</th><th>발주처</th>" +
    '<th class="right">기초금액</th><th class="right">투찰금액</th><th>결과</th>' +
    '<th class="right">낙찰금액</th><th>후속업무</th></tr></thead><tbody>' +
    (rows || '<tr><td colspan="8" class="small">등록된 공고가 없습니다.</td></tr>') +
    "</tbody></table></div>";

  return '<div class="page-head"><h1>나라장터</h1><p>나라장터 입찰 공고 진행 현황입니다. (업무 스케줄과 별도로 관리됩니다)</p></div>' +
    summary + table;
};
