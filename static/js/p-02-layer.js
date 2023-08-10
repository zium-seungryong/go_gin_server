// 파라미터에서 이벤트 시퀀스 가져오기
const urlParams = new URL(location.href).searchParams;
const evetSeq = urlParams.get("evetSeq");
console.log(evetSeq);
// 파라미터에서 이벤트 시퀀스를 가져오면 실행
if (evetSeq != null) {
  // 이벤트 제목 및 발생 시각 가져오기
  const evetUrl = apiUrl + "getStatEvetHist?evetSeq=" + evetSeq;

  getApi(evetUrl, evetInfo);

  function evetInfo(jsonData) {
    const evetTitle = document.getElementById("evetTitle");
    const evetDtm = document.getElementById("evetDtm");
    evetTitle.innerHTML = jsonData.evetNm || "-";
    evetDtm.innerHTML = formatDateTime1(jsonData.outbDtm) || "-";

    const eventOrderBox = document.querySelector(".event-order-box"); //그림 영역
    eventOrderBox.innerHTML = ""; //내용제거
    // 첫번 째 그림 (상황 이벤트 내용)
    const firstUlClass = document.createElement("ul");
    firstUlClass.className = "flex jcs aic mt24 ab-align";
    firstUlClass.innerHTML = `
    <li class="">
    <div class="action-box-r none"></div>
    </li>
    <li class="circle c-type1">
    <span class="f16 y-middle">1</span>
    </li>
    `;
    const fristLiArea = document.createElement("li");
    fristLiArea.className = "event-wd-r";
    const fristDivAreaBox = document.createElement("div");
    fristDivAreaBox.className = "action-box-r ab-type1 active";
    const fristDivAreaBoxIn = document.createElement("div");
    fristDivAreaBoxIn.className = "action-box-in";
    const statEvettitleArea = document.createElement("div");
    statEvettitleArea.className = "tit-text cred tb";
    statEvettitleArea.innerHTML = jsonData.evetNm || "-";
    const firstBoxUlArea = document.createElement("ul");
    const firstInnerLiArea = document.createElement("li");
    firstInnerLiArea.className = "sub-text flex aic mt28 mb12";
    firstInnerLiArea.innerHTML = `
    <span class="img-box ico-timer"></span>
    <span class="set-w-st cgr300">발생시간</span>
    `; // 아이콘
    const firstDetailInnerArea = document.createElement("span");
    firstDetailInnerArea.className = "cfff";
    firstDetailInnerArea.innerHTML = formatDateTime1(jsonData.outbDtm) || "-";
    // 첫번째 내용 삽입
    firstInnerLiArea.appendChild(firstDetailInnerArea);
    firstBoxUlArea.appendChild(firstInnerLiArea);
    statEvettitleArea.appendChild(firstBoxUlArea);
    fristDivAreaBoxIn.appendChild(statEvettitleArea);
    fristDivAreaBoxIn.appendChild(firstBoxUlArea);
    fristDivAreaBox.appendChild(fristDivAreaBoxIn);
    fristLiArea.appendChild(fristDivAreaBox);
    firstUlClass.appendChild(fristLiArea);
    eventOrderBox.appendChild(firstUlClass);
  }

  //체크리스트 내용채우기

  const reactListUrl = apiUrl + "checkListInfo?evetSeq=" + evetSeq;

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
        <button class="tb-btn type-2 mr12" onClick="btnClick(this)">
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
function btnClick(btnCell) {
  const clickTbRow = btnCell.closest(".detailRow");

  const detailNmTd = clickTbRow.querySelector("td:first-child").textContent; //상세 대응 명
  const detailDtmTd = clickTbRow.querySelector("td:nth-child(2)"); //조치시각 reponse가 ok면 후에 대응시각 기입

  const btnDetail = btnCell.textContent; //대응 내역

  // 대응 단계
  const tabArea = document.getElementById("tabArea");
  const reactGd = tabArea.querySelector(".active").textContent;

  console.log(detailDtmTd);

  // 대응시각 구하기
  const fullDtm = nowDtm();
  console.log(fullDtm);

  let data = "";

  if (clickTbRow.id != "") {
    data = {
      id: Number(clickTbRow.id),
      evetSeq: evetSeq, // 이벤트 시퀀스
      reactGd: reactGd, //대응단계
      Detail: detailNmTd, //상세대응
      DetailCheck: btnDetail.trim(), //대응여부
      CheckTime: fullDtm, //대응시각
    };
  } else {
    data = {
      evetSeq: evetSeq, // 이벤트 시퀀스
      reactGd: reactGd, //대응단계
      Detail: detailNmTd, //상세대응
      DetailCheck: btnDetail.trim(), //대응여부
      CheckTime: fullDtm, //대응시각
    };
  }

  console.log(data);

  const detailHistInsertUrl = apiUrl + "detailHistInsert";

  fetch(detailHistInsertUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((responseData) => {
      console.log(responseData);
      detailDtmTd.innerHTML = responseData.CheckTime; //조치시간 삽입
      clickTbRow.id = responseData.ID; // 수정용 ID 생성
      // 조치 시 조치 내역 버튼에 표시
      btnCell.classList.remove("type-2");
      btnCell.classList.add("type-1");
      reactIconList();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function reactIconList() {
  const reactIconListUrl = apiUrl + "iconDetailHist?evetSeq=" + evetSeq;

  getApi(reactIconListUrl, iconCreate);
}

function iconCreate(jsonData) {
  const eventOrderBox = document.querySelector(".event-order-box"); //그림 영역
  console.log(eventOrderBox);

  const firstArea = eventOrderBox.querySelectorAll(
    ".flex.jcs.aic.mt24.ab-align"
  );

  console.log(firstArea);

  if (firstArea.length > 1) {
    for (let i = firstArea.length - 1; i > 0; i--) {
      eventOrderBox.removeChild(firstArea[i]);
    }
  }

  for (let i = 0; i < jsonData.length; i++) {
    // 내용 삽입
    const iconUlClass = document.createElement("ul");
    iconUlClass.className = "flex jcs aic mt24 ab-align";
    iconUlClass.innerHTML = `
    <li class="">
    <div class="action-box-r none"></div>
    </li>
    `;

    // 왼쪽 동그라미 생성 및 추가
    const innerCircleArea = document.createElement("li");
    innerCircleArea.className = "circle c-type2";
    const innerCircleIndexArea = document.createElement("span");
    innerCircleIndexArea.className = "f16 y-middle";
    innerCircleIndexArea.innerHTML = i + 2; //i영역 계속 추가

    innerCircleArea.appendChild(innerCircleIndexArea);
    iconUlClass.appendChild(innerCircleArea);

    // 박스 생성 및 추가
    const innerLiArea = document.createElement("li");
    innerLiArea.className = "event-wd-r";
    const boxDivArea = document.createElement("div");
    boxDivArea.className = "action-box-r ab-type2 active";
    const boxInnerArea = document.createElement("div");
    boxInnerArea.className = "action-box-in";
    const boxTitleArea = document.createElement("div");
    boxTitleArea.className = "tit-text corange tb";
    boxTitleArea.innerHTML = jsonData[i].ReactGd || "-";
    const boxUlArea = document.createElement("ul");
    // 상세대응
    const boxLiArea = document.createElement("li");
    boxLiArea.innerHTML = `
    <span class="img-box ico-location"></span>
    <span class="set-w-st cgr300">상세대응</span>
    `;
    const detailNmSpan = document.createElement("span");
    detailNmSpan.className = "cfff";
    detailNmSpan.innerHTML = jsonData[i].Detail;
    boxLiArea.appendChild(detailNmSpan);
    // 대응시간
    const boxLiArea2 = document.createElement("li");
    boxLiArea2.innerHTML = `
    <span class="img-box ico-location"></span>
    <span class="set-w-st cgr300">조치시간</span>
    `;
    const detailDtmSpan = document.createElement("span");
    detailDtmSpan.className = "cfff";
    detailDtmSpan.innerHTML = jsonData[i].CheckTime;
    boxLiArea2.appendChild(detailDtmSpan);

    boxUlArea.appendChild(boxLiArea);
    boxUlArea.appendChild(boxLiArea2);

    // 추가
    boxInnerArea.appendChild(boxTitleArea);
    boxInnerArea.appendChild(boxUlArea);
    boxDivArea.appendChild(boxInnerArea);
    innerLiArea.appendChild(boxDivArea);
    iconUlClass.appendChild(innerLiArea);
    eventOrderBox.appendChild(iconUlClass);
  }
}

// 상황 조치 완료

document.getElementById("saveBtn").addEventListener("click", function () {
  const modalReporterNm = document.getElementById("modalReporterNm").value;
  const evetTitle = document.getElementById("evetTitle");

  if (modalReporterNm == "") {
    alert("조치자 이름을 입력하여 주세요");
    return;
  }

  const fullDtm = nowDtm();

  const data = {
    evetSeq: evetSeq,
    statEvetCd: "",
    statEvetNm: evetTitle.textContent,
    reporterNm: modalReporterNm,
    reportDtm: fullDtm,
  };

  console.log(data);

  const reporterInsertUrl = apiUrl + "reporterInsert";

  postApi(reporterInsertUrl, data, statEvetEnd);
});

function statEvetEnd(jsonData) {
  // 상황이벤트 종료 로직 삽입
  console.log(jsonData);
  alert("상황 이벤트가 종료되었습니다.");
  // 모달 종료 or 창 종료
  $(".modal-area, .modal-box").removeClass("active");
  $("body").removeClass("active");
}
