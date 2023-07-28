function listTable(jsonData) {
  //테이블 정보 가져오기
  const table = document.getElementById("eventTable");
  const tbody = table.getElementsByTagName("tbody")[0];

  if (jsonData.length == 0) {
    console.log("json data 없음");
    return;
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

    startDate = "1994-03-08";
    endDate = year + "-" + month + "-" + day;
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

document.getElementById("endBtn").addEventListener("click", function () {
  const arrayList = CheckList("all_check", ".check-type");
  console.log(arrayList);
});
