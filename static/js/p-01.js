function listTable(jsonData) {
  //테이블 정보 가져오기
  const table = document.getElementById("eventTable");
  const tbody = table.getElementsByTagName("tbody")[0];

  if (jsonData.length == 0) {
    console.log("json data 없음");
    alert("조회된 데이터가 없습니다");
  }

  const arrayData = jsonData;

  tbody.innerHTML = "";

  for (let i = 0; i < arrayData.length; i++) {
    const row = tbody.insertRow(i);
    row.id = arrayData[i].StatEvetOutbSeqn;
    const checkboxCell = row.insertCell(0); //체크박스
    const evetNmCell = row.insertCell(1); //이벤트명
    const evenCntnCell = row.insertCell(2); //내용
    const outbDtmCell = row.insertCell(3); //발생시각
    const procStCell = row.insertCell(4); //경과

    const checkboxDiv = document.createElement("div");
    checkboxDiv.className = "check-box";

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.id = arrayData[i].StatEvetOutbSeqn; //차량 번호로
    checkboxInput.className = "check-type";

    let outbDtm = "";
    if (arrayData[i].OutbDtm != "") {
      outbDtm = formatDateTime1(arrayData[i].OutbDtm);
    }

    let action = "";
    const actionSpan = document.createElement("span");
    switch (arrayData[i].ProcSt) {
      case "1":
        actionSpan.classList.add("process-stiker");
        actionSpan.classList.add("str-3");
        action = "발생";
        break;
      case "3":
        actionSpan.classList.add("process-stiker");
        actionSpan.classList.add("str-2");
        action = "진행";
        break;
      case "5":
        actionSpan.classList.add("process-stiker");
        actionSpan.classList.add("str-1");
        action = "종료";
        break;
      default:
        action = "-";
    }

    checkboxDiv.appendChild(checkboxInput);
    checkboxCell.appendChild(checkboxDiv);

    actionSpan.innerHTML = action || "-";
    // td에 데이터 입력
    evetNmCell.innerHTML = arrayData[i].StatEvetNm || "-";
    evetNmCell.classList.add("eventRow");
    evenCntnCell.innerHTML = arrayData[i].StatEvetCntn || "-";
    evenCntnCell.classList.add("eventRow");
    outbDtmCell.innerHTML = outbDtm || "-";
    outbDtmCell.classList.add("eventRow");
    procStCell.appendChild(actionSpan);
    procStCell.classList.add("eventRow");

    if (arrayData[i].StatEvetGdCd > 89) {
      row.style.backgroundColor = "rgba(217, 50, 78, 0.60)"; //90 이상은 빨강
    } else if (arrayData[i].StatEvetGdCd > 59) {
      row.style.backgroundColor = "rgba(29, 122, 0, 0.60)"; //60 이상은 주황
    }
  }
  //   페이지

  // row 클릭 시
  const eventRowElements = document.querySelectorAll(".eventRow");
  eventRowElements.forEach(function (td) {
    td.addEventListener("click", function () {
      const rowEvetSeq = td.closest("tr").id;
      console.log(rowEvetSeq);

      // 새 창의 크기를 화면의 너비와 높이로 설정합니다.
      const width = window.screen.availWidth;
      const height = window.screen.availHeight;

      // 새 창을 최대 크기로 열기 위한 속성들을 설정합니다.
      const windowFeatures = [
        "width=" + width,
        "height=" + height,
        "left=0",
        "top=0",
        "fullscreen=yes", // 최대화 모드로 열기 위한 속성입니다.
        "resizable=yes", // 크기 조정 가능하도록 설정합니다.
        "scrollbars=yes", // 스크롤바를 표시합니다.
      ].join(",");

      // 새 창을 엽니다.
      window.open(
        "http://localhost:8080/page/checkList?evetSeq=" + rowEvetSeq,
        "_blank",
        windowFeatures
      );
    });
  });
}

function tableData() {
  const startDateElement = document.getElementById("startDate");
  const endDateElement = document.getElementById("endDate");
  const searchElement = document.getElementById("evetName");

  let startDate = startDateElement.value;
  let endDate = endDateElement.value;
  const evetNm = searchElement.value;

  if (startDate == "" || endDate == "") {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(today.getDate()).padStart(2, "0");

    // 오늘로 부터 일주일 전 데이터 까지
    const currentDate = new Date();

    // 일주일 전의 날짜 계산
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(currentDate.getDate() - 7);

    console.log(oneWeekAgo.toISOString().split("T")[0]);

    startDate = oneWeekAgo.toISOString().split("T")[0];
    startDate = startDate + " 00:00:00";
    endDate = year + "-" + month + "-" + day + " 23:59:59";
  } else {
    startDate = startDate + " 00:00:00";
    endDate = endDate + " 23:59:59";

    console.log(startDate);
    console.log(endDate);
  }

  if (startDate > endDate) {
    alert("발생시각을 올바르게 설정하여 주세요");
    return;
  }

  listUrl =
    "http://localhost:8080/api/statEvetOutbList?" +
    "startDate=" +
    startDate +
    "&endDate=" +
    endDate +
    "&procSt=5" +
    "&evetNm=" +
    evetNm;

  console.log(listUrl);
  getApi(listUrl, listTable);

  setTimeout(tableData, 5 * 60 * 10000);
}

document.getElementById("searchBtn").addEventListener("click", function () {
  const startDateElement = document.getElementById("startDate");
  const endDateElement = document.getElementById("endDate");

  let startDate = startDateElement.value;
  let endDate = endDateElement.value;

  if (startDate != "" && endDate == "") {
    alert("종료 시각을 선택하여 주세요");
    return;
  }

  if (startDate == "" && endDate != "") {
    alert("시작 시각을 선택하여 주세요");
    return;
  }
  tableData(); //1page
});

// 이벤트 종료 버튼 클릭 시
document.getElementById("endBtn").addEventListener("click", function () {
  const arrayList = CheckList("all_check", ".check-type");
  console.log(arrayList);
  if (arrayList.length == 0) {
    alert("종료할 이벤트를 선택하여 주세요");
    return;
  }

  // modal on 종료자 이름
  $(".modal-area, .event-rgdt").toggleClass("active");
  $("body").addClass("active");
});

// 저장 버튼 클릭 시
document.getElementById("saveBtn").addEventListener("click", function () {
  const modalReporterNm = document.getElementById("modalReporterNm").value;

  if (modalReporterNm == "") {
    alert("조치자 이름을 입력하여 주세요");
    return;
  }
  const arrayList = CheckList("all_check", ".check-type");
  console.log(arrayList);

  const fullDtm = nowDtm();

  const reporterInsertUrl = "http://localhost:8080/api/reporterInsert";

  // 종료 api로 전송 및 저장
  for (let i = 0; i < arrayList.length; i++) {
    const evetSeq = arrayList[i];

    const data = {
      evetSeq: evetSeq,
      statEvetCd: "",
      statEvetNm: "이벤트 명",
      reporterNm: modalReporterNm,
      reportDtm: fullDtm,
    };

    console.log(reporterInsertUrl);
    console.log(data);
    // postApi(reporterInsertUrl, data, statEvetEnd);
  }
});
