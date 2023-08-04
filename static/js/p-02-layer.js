// 파라미터에서 이벤트 시퀀스 가져오기
const urlParams = new URL(location.href).searchParams;
const evetSeq = urlParams.get("evetSeq");
console.log(evetSeq);
// 파라미터에서 이벤트 시퀀스를 가져오면 실행
if (evetSeq != null) {
  // 이벤트 제목 및 발생 시각 가져오기
  const evetUrl =
    "http://localhost:8080/api/getStatEvetHist?evetSeq=" + evetSeq;

  getApi(evetUrl, evetInfo);

  function evetInfo(jsonData) {
    const evetTitle = document.getElementById("evetTitle");
    const evetDtm = document.getElementById("evetDtm");
    evetTitle.innerHTML = jsonData.evetNm || "-";
    evetDtm.innerHTML = formatDateTime1(jsonData.outbDtm) || "-";
  }

  //체크리스트 내용채우기

  const reactListUrl =
    "http://localhost:8080/api/checkListInfo?evetSeq=" + evetSeq;

  getApi(reactListUrl, tabList);

  function tabList(jsonData) {
    const tabArea = document.getElementById("tabArea");
    const contentArea = document.getElementById("contentArea");
    //tabArea 초기화
    tabArea.innerHTML = "";
    contentArea.innerHTML = "";

    if (jsonData.length == 0 || jsonData.length == null) {
      console.log("jsonData가 없습니다");
      return;
    }
    for (let i = 0; i < jsonData.length; i++) {
      // 탭 생성
      const liArea = document.createElement("li");
      const aArea = document.createElement("a");
      aArea.href = "#tab" + jsonData[i].reactGdNum + "-1";
      aArea.innerHTML = jsonData[i].reactGd;
      liArea.appendChild(aArea);
      tabArea.appendChild(liArea);
      // 테이블 영역 생성
      const tableLiArea = document.createElement("li");
      const tableDivArea = document.createElement("div");
      const tableArea = document.createElement("table");
      const tbodyArea = document.createElement("tbody");

      tableLiArea.id = "tab" + jsonData[i].reactGdNum + "-1";
      tableDivArea.className = "table-box set-h tac";
      tableArea.className = "tb-type-1 separate";
      tableArea.innerHTML = `
      <colgroup>
                                <col width="" />
                                <col width="" />
                                <col width="" />
                              </colgroup>
                              <thead>
                                <tr>
                                  <th>상세대응</th>
                                  <th>조치시간</th>
                                  <th>조치</th>
                                </tr>
                              </thead>
      `;

      const detailArray = jsonData[i].detailList;

      for (let v = 0; v < detailArray.length; v++) {
        const newRow = tbodyArea.insertRow(v);
        newRow.className = "detailRow";
        // 새로운 행에 셀 추가
        const detailCell = newRow.insertCell(0); //상세 대응
        const detailDtnCell = newRow.insertCell(1); //대응 시각
        const btnCell = newRow.insertCell(2); //버튼

        detailCell.innerHTML = detailArray[v].detail;
        detailDtnCell.innerHTML = "";
        btnCell.className = "flex jcc aic mt4";
        btnCell.innerHTML = `
        <button class="tb-btn type-1 mr12" onClick="btnClick(this)">
        시행
      </button>
      <button class="tb-btn type-2" onClick="btnClick(this)">
        미시행
      </button>
        `;
      }
      tableArea.appendChild(tbodyArea);
      tableDivArea.appendChild(tableArea);
      tableLiArea.appendChild(tableDivArea);
      contentArea.appendChild(tableLiArea);
    }
    const liElements = tabArea.getElementsByTagName("li");

    // 탭 활성/비활성 클래스 추가
    for (let i = 0; i < liElements.length; i++) {
      const anchorElement = liElements[i].getElementsByTagName("a")[0];
      if (i === 0) {
        anchorElement.classList.add("active");
      } else {
        anchorElement.classList.add("block");
      }
    }

    // 탭 변경
    $(
      ".tab-cnt-box > li:not(" +
        $(".tab-menu-box > li > a.active").attr("href") +
        ")"
    ).hide();
    $(".tab-menu-box > li > a").click(function () {
      $(".tab-menu-box > li > a").removeClass("active");
      $(this).addClass("active");
      $(".tab-cnt-box > li").hide();
      $($(this).attr("href")).show();
      return false;
    });
  }
}
// 버튼 클릭 시 저장 조치 사항 저장
// 비동기 통신 후 response에 오는 값을 조치 시간에 표시
// 전파 관련은 고민 중 상세 대응 명에 '전파'가 들어가면 modal을 띄우게 할까
function btnClick(tableRow) {
  const clickTbRow = tableRow.closest(".detailRow");
  console.log(tableRow);

  const detailNmTd = clickTbRow.querySelector("td:first-child").textContent; //상세 대응 명
  const detailDtmTd = clickTbRow.querySelector("td:nth-child(2)"); //조치시각

  console.log(detailDtmTd);

  // 대응시각 구하기
  const fullDtm = nowDtm();
  console.log(fullDtm);
  const data = {
    evetSeq: evetSeq, // 이벤트 시퀀스
    reactGd: "", //대응단계
    Detail: detailNmTd, //상세대응
    DetailCheck: "", //대응여부
    CheckTime: fullDtm, //대응시각
  };

  console.log(data);
}
