$(document).ready(function () {
  // 클래스가 "myClass"인 모든 요소를 선택합니다.
  $(".ic-down").on("click", function () {
    // 현재 클릭된 아코디언 행의 다음 형제(tr.tb-detail)의 tb-boxin-area 클래스를 토글합니다.
    $(this).closest("tr").next("tr.tb-detail").find(".tb-boxin-area").toggle();
  });
});

// 셀렉트 박스 내용 가져오는 api
function getSelectBoxList() {
  const statEvetInfoListUrl = "http://localhost:8080/api/statEvetInfoList";

  getApi(statEvetInfoListUrl, selectBoxFun);
}

function selectBoxFun(jsonData) {
  const selectElement = document.getElementById("selectBox");
  // jsonData를 기반으로 option 요소를 생성하여 select 요소에 추가합니다.
  jsonData.forEach(function (item) {
    const optionElement = document.createElement("option");
    optionElement.value = item.SvcThemeCd + "-" + item.StatEvetCd; // value에 id를 설정합니다.
    optionElement.textContent = item.StatEvetNm; // 내용을 설정합니다.
    selectElement.appendChild(optionElement); // option을 select에 추가합니다.
  });

  tableData();
}

getSelectBoxList();

// 검색

document.getElementById("searchBtn").addEventListener("click", function () {
  const selectElement = document.getElementById("selectBox");
  const selectedOption = selectElement.options[selectElement.selectedIndex];

  const selectedOptionContent = selectedOption.textContent;
  const selectedOptionId = selectedOption.value;

  if (
    selectedOptionContent == null ||
    selectedOptionContent == "" ||
    selectedOptionId == null ||
    selectedOptionId == ""
  ) {
    alert("상황 이벤트를  선택하여 주세요");
    return;
  }

  console.log("선택된 옵션 내용:", selectedOptionContent);
  console.log("선택된 옵션 ID:", selectedOptionId);
  console.log();
});

// 등록

// 테이블
function listTable(jsonData) {
  //테이블 정보 가져오기
  const table = document.getElementById("statTable");
  const tbody = table.getElementsByTagName("tbody")[0];

  if (jsonData.length == 0) {
    console.log("json data 없음");
    return;
  }

  const arrayData = jsonData;

  tbody.innerHTML = "";
  let v = 0;
  for (let i = 0; i < arrayData.length; i++) {
    let row = tbody.insertRow(v);
    row.className = "tabeRow";
    row.id = arrayData[i].reactGdNum;
    const checkBoxCell = row.insertCell(0); //체크 박스
    const evetIdCell = row.insertCell(1); //이벤트 ID
    const statEvetNmCell = row.insertCell(2); //상황 이벤트 명
    const reactGdCell = row.insertCell(3); //대응 단계 명
    const reactGdNumCell = row.insertCell(4); //대응 표시 순서
    const iconCell = row.insertCell(5); //상세

    const evetId =
      arrayData[i].ClientCd +
      "-" +
      arrayData[i].SiteCd +
      "-" +
      arrayData[i].ZnCd +
      arrayData[i].svcThemeCd +
      arrayData[i].UnitSvcCd +
      "E" +
      arrayData[i].statEvetCd;

    const checkboxDiv = document.createElement("div");
    checkboxDiv.className = "check-box";

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.id = arrayData[i].StatEvetOutbSeqn;
    checkboxInput.className = "check-type";

    checkboxDiv.appendChild(checkboxInput);
    checkBoxCell.appendChild(checkboxDiv);
    evetIdCell.innerHTML = evetId || "-";
    statEvetNmCell.innerHTML = arrayData[i].statEvetNm || "-";
    reactGdCell.innerHTML = arrayData[i].reactGd || "-";
    reactGdNumCell.innerHTML = arrayData[i].reactGdNum || "-";
    iconCell.innerHTML = `<span class="ic-down"></span>`;

    const statArray = arrayData[i].detailList;
    console.log(i);
    console.log(statArray);

    v++;

    // 상세 영역
    row = tbody.insertRow(v);
    row.className = "tb-detail";
    const colpanCell = row.insertCell(0); //체크 박스
    colpanCell.setAttribute("colspan", "9");
    const boxArea = document.createElement("div");
    boxArea.className = "tb-boxin-area";
    boxArea.innerHTML = `<div class="flex aic jcsb">
    <p class="cgr300 f14">상세</p>
    <span class="btn-wrap flex">
      <button class="tb-btn type-1 mr8" id="innerAddBtn" onClick="addRow(this)" >
        + 대응 단계 추가
      </button>
      <button class="tb-btn type-2" id="innerDelBtn" onClick="delRow()">삭제</button>
    </span>
  </div>`;

    colpanCell.appendChild(boxArea); //버튼 추가
    const tableArea = document.createElement("table");
    tableArea.className = "tb-boxin separate mt12 tb-input-text";
    const colgroupArea = document.createElement("colgroup");
    colgroupArea.innerHTML = `
    <col width="" />
    <col width="" />
    <col width="" />
    <col width="" />
    <col width="" />
    `;
    const theadArea = document.createElement("thead");
    theadArea.innerHTML = `
                          <thead>
                            <tr class="hover-none">
                              <th>
                                <div class="check-box">
                                  <input type="checkbox" class="check-type" />
                                </div>
                              </th>
                              <th>상세 대응 단계 명</th>
                            </tr>
                          </thead>
    `;
    tableArea.appendChild(colgroupArea); //table에 colgroup 추가
    tableArea.appendChild(theadArea); //테이블에 thead 추가

    const tbodyArea = document.createElement("tbody"); //tbody 생성
    tbodyArea.className = "innerTable";
    tbodyArea.innerHTML = "";
    //  tbody에 내용추가
    for (let k = 0; k < statArray.length; k++) {
      let innerRow = tbodyArea.insertRow(k);
      // innerRow.className = "aaaa";
      // innerRow.id = k;
      const innerCheckBoxCell = innerRow.insertCell(0); //체크 박스
      const innerDetailCell = innerRow.insertCell(1); //상황 대응

      const innerCheckboxDiv = document.createElement("div");
      innerCheckboxDiv.className = "check-box";

      const innerCheckboxInput = document.createElement("input");
      innerCheckboxInput.type = "checkbox";
      innerCheckboxInput.id = statArray[k].detailNum;
      innerCheckboxInput.className = "check-type";

      innerCheckboxDiv.appendChild(innerCheckboxInput);
      innerCheckBoxCell.appendChild(innerCheckboxDiv);

      const innerDetailInput = document.createElement("input");
      innerDetailInput.type = "text";
      innerDetailInput.className = "tb-edit";
      innerDetailInput.value = statArray[k].detail || null;
      innerDetailInput.placeholder = "내용입력";
      innerDetailCell.className = "pr4";
      innerDetailCell.appendChild(innerDetailInput); //td 에 input 영역 추가
      tableArea.appendChild(tbodyArea); //table에 tbody 추가
    }
    boxArea.appendChild(tableArea); //테이블 div tb-boxin-area 에 추가

    v++;

    $(document).ready(function () {
      // 클래스가 "myClass"인 모든 요소를 선택합니다.
      $(".ic-down").on("click", function () {
        // 현재 클릭된 아코디언 행의 다음 형제(tr.tb-detail)의 tb-boxin-area 클래스를 토글합니다.
        $(this)
          .closest("tr")
          .next("tr.tb-detail")
          .find(".tb-boxin-area")
          .toggle();
      });
    });
  }
}

function tableData() {
  const selectElement = document.getElementById("selectBox");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const selectedOptionId = selectedOption.value;

  const separatedArray = selectedOptionId.split("-");
  const firstPart = separatedArray[0]; // "DIE"
  const secondPart = separatedArray[1]; // "15"

  listUrl =
    "http://localhost:8080/api/getstatEvetReactList?svcThemeCd=" +
    firstPart +
    "&statEvetCd=" +
    secondPart;

  console.log(listUrl);
  getApi(listUrl, listTable);

  setTimeout(tableData, 5 * 60 * 10000);
}

function addRow(button) {
  // 버튼 클릭 시 실행될 함수

  var tbBoxinArea = button.closest(".tb-boxin-area");

  // div 내부에 있는 하위 tbody의 ID가 "innerTable"인 테이블 찾기
  var innerTbody = tbBoxinArea.querySelector(".innerTable");

  // 새로운 행(row) 생성
  const newRow = document.createElement("tr");

  // 새로운 행에 셀 추가
  const newCheckBoxCell = newRow.insertCell(0); //체크 박스
  const newDetailCell = newRow.insertCell(1); //상황 대응

  const newCheckboxDiv = document.createElement("div");
  newCheckboxDiv.className = "check-box";

  const newCheckboxInput = document.createElement("input");
  newCheckboxInput.type = "checkbox";
  // newCheckboxInput.id = ;
  newCheckboxInput.className = "check-type";

  newCheckboxDiv.appendChild(newCheckboxInput);
  newCheckBoxCell.appendChild(newCheckboxDiv);

  const newDetailInput = document.createElement("input");
  newDetailInput.type = "text";
  newDetailInput.className = "tb-edit";
  newDetailInput.placeholder = "내용입력";
  newDetailCell.className = "pr4";
  newDetailCell.appendChild(newDetailInput);

  newRow.appendChild(newCheckBoxCell);
  newRow.appendChild(newDetailCell);

  // 테이블의 tbody에 새로운 행 추가
  innerTbody.appendChild(newRow);
}
