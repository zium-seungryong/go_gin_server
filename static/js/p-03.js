// 테이블 내용을 생성하는 js

function listTable(jsonData) {
  //테이블 정보 가져오기
  const table = document.getElementById("eventTable");
  const tbody = table.getElementsByTagName("tbody")[0];

  const arrayData = jsonData.data;

  if (arrayData.length == 0) {
    console.log("json data 없음");
    alert("조회된 데이터가 없습니다");
  }

  tbody.innerHTML = "";

  for (let i = 0; i < arrayData.length; i++) {
    const row = tbody.insertRow(i);
    row.id = arrayData[i].StatEvetOutbSeqn;
    row.classList.add("modal-event-rgdt");
    row.classList.add("eventRow");
    const evetNmCell = row.insertCell(0); //이벤트명
    const reporterNmCell = row.insertCell(1); //조치자
    const outbDtmCell = row.insertCell(2); //발생시각
    const reporterDtmCell = row.insertCell(3); //조치시각
    const procStCell = row.insertCell(4); //경과

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

    actionSpan.innerHTML = action || "-";

    evetNmCell.innerHTML = arrayData[i].StatEvetNm || "-";
    reporterNmCell.innerHTML = arrayData[i].ReporterNm || "-";
    outbDtmCell.innerHTML = outbDtm || "-";
    reporterDtmCell.innerHTML = arrayData[i].ReportDtm || "-";
    procStCell.appendChild(actionSpan);
  }
  //   페이지
  createPagination(jsonData);

  // row 클릭 시

  const eventRowElements = document.querySelectorAll(".eventRow");

  eventRowElements.forEach(function (row) {
    row.addEventListener("click", function (event) {
      // 클릭된 row의 id 값을 가져옵니다.
      const clickedRowId = event.currentTarget.id;
      const modalArea = document.querySelector(".modal-area");
      const eventRgdt = document.querySelector(".event-rgdt");
      const body = document.querySelector("body");

      modalArea.classList.toggle("active");
      eventRgdt.classList.toggle("active");
      body.classList.add("active");
      const url = apiUrl + "getStatEvetHist?evetSeq=" + clickedRowId;

      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (response) {
          console.log(response);
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          const modalTitleElements = document.querySelectorAll(".modal-title");
          modalTitleElements.forEach(function (element) {
            element.id = clickedRowId;
            element.innerHTML = data.evetNm;
          });

          const outbDtm = formatDateTime1(data.outbDtm);

          const evetOutbDtm = document.getElementById("evet_outb_time");
          const evetCntn = document.getElementById("evet_cntn");
          const procSt = document.getElementById("proc_st");
          const detailCntn = document.getElementById("detail_cntn");
          const detailBody = detailCntn.getElementsByTagName("tbody")[0];
          const reporterNm = document.getElementById("reporter_nm");
          const reporterDtm = document.getElementById("reporter_dtm");
          evetOutbDtm.innerHTML = outbDtm || "-";
          evetCntn.innerHTML = data.evetCntn || "-";
          procSt.innerHTML = data.evetNm || "-";
          reporterNm.innerHTML = data.reporter || "-";
          reporterDtm.innerHTML = data.reporterDtm || "-";

          const detailData = data.detailCntn;

          detailBody.innerHTML = "";
          detailBody.className = "tac";
          if (detailData != 0) {
            for (let v = 0; v < detailData.length; v++) {
              const row = detailBody.insertRow(v);
              const reactGd = row.insertCell(0); //대응단계
              const detail = row.insertCell(1); //상세대응
              const detailCk = row.insertCell(2); //대응여부
              const ckTime = row.insertCell(3); //대응시각

              reactGd.innerHTML = detailData[v].ReactGd || "-";
              detail.innerHTML = detailData[v].Detail || "-";
              detailCk.innerHTML = detailData[v].DetailCheck;
              ckTime.innerHTML = detailData[v].CheckTime || "-";
            }
          }
        })
        .catch(function (error) {
          console.log("ajax error:", error);
        });
    });
  });
}

function tableData(pageNum) {
  const startDateElement = document.getElementById("startDate");
  const endDateElement = document.getElementById("endDate");
  const searchElement = document.getElementById("reportName");

  let startDate = startDateElement.value;
  let endDate = endDateElement.value;
  const reporterNm = searchElement.value;

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
    apiUrl +
    "reporterHistList?" +
    "page=" +
    pageNum +
    "&pageSize=12&startDate=" +
    startDate +
    " 00:00:00" +
    "&endDate=" +
    endDate +
    " 23:59:59" +
    // "&procSt=5" +
    "&reporterNm=" +
    reporterNm;

  console.log(listUrl);
  getApi(listUrl, listTable);

  setTimeout(tableData, 5 * 60 * 10000);
}

// 검색
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

  tableData(1); //1page
});
