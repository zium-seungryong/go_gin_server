// $(document).ready(function () {
//   // 클래스가 "myClass"인 모든 요소를 선택합니다.
//   $(".ic-down").on("click", function () {
//     // 현재 클릭된 아코디언 행의 다음 형제(tr.tb-detail)의 tb-boxin-area 클래스를 토글합니다.
//     $(this).closest("tr").next("tr.tb-detail").find(".tb-boxin-area").toggle();
//   });
// });

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

  tableData();
});

// 테이블
function listTable(jsonData) {
  //테이블 정보 가져오기
  const table = document.getElementById("statTable");
  const tbody = table.getElementsByTagName("tbody")[0];

  tbody.innerHTML = "";
  if (jsonData.length == 0) {
    console.log("json data 없음");
    return;
  }

  const arrayData = jsonData;

  let v = 0;
  for (let i = 0; i < arrayData.length; i++) {
    let row = tbody.insertRow(v);
    row.className = "tabelRow";
    row.id = arrayData[i].ID;
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
    checkboxInput.id = evetId + "_" + arrayData[i].reactGdNum;
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
      <button class="tb-btn type-2" id="innerDelBtn" onClick="delRow(this)">삭제</button>
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
    theadArea.innerHTML =
      `
                          <thead>
                            <tr class="hover-none">
                              <th>
                                <div class="check-box">
                                  <input type="checkbox" class="check-type" id="all_check" onChange="onAllCheckChange(this)"/>
                                </div>
                              </th>
                              <th class="reactGd" id="` +
      arrayData[i].reactGd +
      `">상세 대응 단계 명</th>
                            </tr>
                          </thead>
    `;
    tableArea.appendChild(colgroupArea); //table에 colgroup 추가
    tableArea.appendChild(theadArea); //테이블에 thead 추가

    const tbodyArea = document.createElement("tbody"); //tbody 생성
    tbodyArea.className = "innerTable";
    tbodyArea.innerHTML = "";
    //  tbody에 내용추가

    if (statArray.length == 0 || statArray.length == null) {
      let innerRow = tbodyArea.insertRow(0);
      const innerCheckBoxCell = innerRow.insertCell(0); //체크 박스
      const innerDetailCell = innerRow.insertCell(1); //상황 대응

      const innerCheckboxDiv = document.createElement("div");
      innerCheckboxDiv.className = "check-box";

      const innerCheckboxInput = document.createElement("input");
      innerCheckboxInput.type = "checkbox";
      innerCheckboxInput.id = 1;
      innerCheckboxInput.className = "check-type";

      innerCheckboxDiv.appendChild(innerCheckboxInput);
      innerCheckBoxCell.appendChild(innerCheckboxDiv);

      const innerDetailInput = document.createElement("input");
      innerDetailInput.type = "text";
      innerDetailInput.className = "tb-edit";
      innerDetailInput.value = "";
      innerDetailInput.placeholder = "내용입력";
      innerDetailCell.className = "pr4";
      innerDetailCell.appendChild(innerDetailInput); //td 에 input 영역 추가
      tableArea.appendChild(tbodyArea); //table에 tbody 추가
    }

    for (let k = 0; k < statArray.length; k++) {
      let innerRow = tbodyArea.insertRow(k);
      const innerCheckBoxCell = innerRow.insertCell(0); //체크 박스
      const innerDetailCell = innerRow.insertCell(1); //상황 대응

      const innerCheckboxDiv = document.createElement("div");
      innerCheckboxDiv.className = "check-box";

      const innerCheckboxInput = document.createElement("input");
      innerCheckboxInput.type = "checkbox";
      innerCheckboxInput.id = statArray[k].ID;
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
    const underDiv = document.createElement("div");
    underDiv.innerHTML = `<div class="flex aic jcc">
    <span class="btn-wrap flex">
      <button class="tb-btn type-1 ml110" id="innerAddBtn" onClick="addDetail(this)" >
        상세대응 저장
      </button>
    </span>
  </div>`;
    boxArea.appendChild(underDiv);

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
  var tbBoxinArea = button.closest(".tb-boxin-area");
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

// 상세 대응 삭제
function delRow(button) {
  const tbBoxinArea = button.closest(".tb-boxin-area");

  const innerTable = tbBoxinArea.querySelector(".innerTable");

  if (!innerTable) {
    console.error("innerTable이 없습니다");
    return;
  }

  const checkboxes = innerTable.querySelectorAll(".check-type");

  const rowsToDelete = [];
  const checkIdList = [];

  checkboxes.forEach(function (checkbox, index) {
    if (checkbox.checked) {
      rowsToDelete.push(index);
      checkIdList.push(checkbox.id);
    }
  });

  // rowsToDelete 배열에 저장된 행 인덱스를 역순으로 정렬합니다.
  // 이렇게 함으로써 삭제할 행들의 인덱스가 내림차순으로 정렬되어 원래의 인덱스와 영향이 없도록 합니다.
  rowsToDelete.sort(function (a, b) {
    return b - a;
  });

  rowsToDelete.forEach(function (index) {
    innerTable.deleteRow(index);
  });

  checkboxes.forEach(function (checkbox) {
    checkbox.checked = false;
  });

  console.log(rowsToDelete);
  console.log(checkIdList);

  for (let i = 0; i < rowsToDelete.length; i++) {
    if (checkIdList[i] != null || checkIdList[i] != "") {
      const deleteUrl =
        "http://localhost:8080/api/deleteDetail/" + checkIdList[i];
      console.log(deleteUrl);
      deleteDelete(deleteUrl);
    }
  }
}

// 상세 테이블 전체 선택
function onAllCheckChange(checkbox) {
  const tbBoxinArea = checkbox.closest(".tb-boxin-area");
  const checkboxes = tbBoxinArea.querySelectorAll(".innerTable .check-type");

  checkboxes.forEach(function (innerCheckbox) {
    if (innerCheckbox !== checkbox) {
      innerCheckbox.checked = checkbox.checked;
    }
  });
}

// 등록
document.getElementById("saveBtn").addEventListener("click", function () {
  const modalEvetId = document.getElementById("modalEvetId");
  const modalReact = document.getElementById("modalReact");
  const modalReactNum = document.getElementById("modalReactNum");
  const modalTableRow = document.getElementById("tableRowId");

  const modalEvetIdVal = modalEvetId.value;
  const modalReactVal = modalReact.value;
  const modalReactNumVal = modalReactNum.value;
  const modalTableRowVal = modalTableRow.value;

  if (modalEvetIdVal == null || modalEvetIdVal == "") {
    alert("이벤트 아이디를  입력하여 주세요");
    return;
  }
  if (modalReactVal == null || modalReactVal == "") {
    alert("상황 구분명을 입력하여 주세요");
    return;
  }
  if (modalReactNumVal == null || modalReactNumVal == "") {
    alert("대응표시 순서를 입력하여 주세요");
    return;
  }

  const acheck = /[A-Z]/g;
  const check = /^[0-9]+$/;
  if (!check.test(modalReactNumVal)) {
    alert("대응표시 순서는 숫자만 입력 하여주세요");
    return;
  }

  saveUrl = "http://localhost:8080/api/reactInsert";

  // evet id SMT-PA3-000DIE001E31
  const svcThemeCd = modalEvetIdVal.substring(11, 14); //DIE
  const statEvetCd = modalEvetIdVal.substring(18, 20); //31

  if (!acheck.test(svcThemeCd)) {
    alert("이벤트 아이디 형식이 잘 못 되었습니다");
    return;
  }
  if (!check.test(statEvetCd)) {
    alert("이벤트 아이디 형식이 잘 못 되었습니다");
    return;
  }

  let data = "";

  if (modalTableRowVal == "" || modalTableRowVal == null) {
    data = {
      svcThemeCd: svcThemeCd,
      statEvetCd: statEvetCd.toString(),
      reactGd: modalReactVal,
      reactGdNum: Number(modalReactNumVal),
    };
  } else {
    data = {
      ID: Number(modalTableRowVal),
      svcThemeCd: svcThemeCd,
      statEvetCd: statEvetCd.toString(),
      reactGd: modalReactVal,
      reactGdNum: Number(modalReactNumVal),
    };
  }

  console.log(data);

  // 입력값 초기화
  modalEvetId.value = "";
  modalReact.value = "";
  modalReactNum.value = "";
  modalTableRow.value = "";

  postApi(saveUrl, data, saveSuccescc);
  // 모달 닫기
  $(".modal-area, .modal-box").removeClass("active");
  $("body").removeClass("active");
});

// 삭제 버튼 클릭 시
document.getElementById("deleteBtn").addEventListener("click", function () {
  const trElements = document.querySelectorAll("tr.tabelRow");

  trElements.forEach((trElement) => {
    const checkBoxElement = trElement.querySelector("input.check-type");

    if (checkBoxElement.checked) {
      const tdElements = trElement.querySelectorAll("td");

      const tdValues = [];

      tdElements.forEach((tdElement, index) => {
        if (index !== 0) {
          tdValues.push(tdElement.textContent);
        }
      });

      // if (tdValues.length == 0) {
      //   alert("상세 대응을 선택하여 주세요");
      //   return;
      // }

      console.log(tdValues);

      const svcThemeCd = tdValues[0].substring(11, 14);
      const statEvetCd = tdValues[0].substring(18, 20);
      const reactGd = tdValues[2];
      const reactGdNum = tdValues[3];

      const deleteUrl =
        "http://localhost:8080/api/deleteReact/" +
        svcThemeCd +
        "/" +
        statEvetCd +
        "/" +
        reactGd +
        "/" +
        reactGdNum;

      const checkUrl =
        "http://localhost:8080/api/getDeleteDetailListCheck/" +
        svcThemeCd +
        "/" +
        statEvetCd +
        "/" +
        reactGd;

      fetch(checkUrl, {
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
          if (data.length == 0 || data == null) {
            deleteDelete(deleteUrl);
            console.log(deleteUrl);
          } else {
            alert("체크된 단계의 상세 대응을 전부 삭제하여 주세요");
          }
        })
        .catch(function (error) {
          console.log("ajax error:", error);
        });
    }
  });

  // alert("성공적으로 삭제 되었습니다");
});

// //수정 버튼 클릭 시
document.getElementById("updateBtn").addEventListener("click", function () {
  const trElements = document.querySelectorAll("tr.tabelRow");

  const otherTdValues = [];
  let trId = getCheckedRowIds();

  if (trId == null || trId == "") {
    alert("상세 대응을 선택하여 주세요");
    return;
  }

  trElements.forEach((trElement) => {
    // 해당 <tr>에 있는 체크박스를 가져옵니다.
    const checkBoxElement = trElement.querySelector("input.check-type");

    // 해당 <tr>의 체크박스가 체크되어 있는 경우에만 값을 가져옵니다.
    if (checkBoxElement.checked) {
      // <tr> 태그 내의 모든 <td> 태그들을 선택합니다.
      const tdElements = trElement.querySelectorAll("td");
      // 체크된 <tr>의 다른 <td> 태그들의 값을 배열에 저장합니다.
      tdElements.forEach((tdElement, index) => {
        if (index !== 0) {
          // 첫 번째 <td>는 체크박스를 포함하므로 건너뜁니다.
          otherTdValues.push(tdElement.textContent);
        }
      });
    }
  });
  if (otherTdValues.length > 5) {
    alert("수정은 한건만 진행할 수 있습니다");
    return;
  } else {
    const modalEvetId = document.getElementById("modalEvetId");
    const modalReact = document.getElementById("modalReact");
    const modalReactNum = document.getElementById("modalReactNum");

    modalEvetId.value = otherTdValues[0] || "-";
    modalReact.value = otherTdValues[2] || "-";
    modalReactNum.value = otherTdValues[3] || "-";
    modalEvetId.readOnly = true;

    const modalTable = document.getElementById("tableRowId");
    modalTable.value = trId;

    console.log(modalTable.value);

    $(".modal-area, .event-rgdt").toggleClass("active");
    $("body").addClass("active");
  }
});

// 등록 버튼 클릭 시
document.getElementById("insertBtn").addEventListener("click", function () {
  //  등록 버튼 클릭 시 내용물 초기화
  const modalEvetId = document.getElementById("modalEvetId");
  const modalReact = document.getElementById("modalReact");
  const modalReactNum = document.getElementById("modalReactNum");
  const modalTableRow = document.getElementById("tableRowId");

  modalEvetId.value = "";
  modalReact.value = "";
  modalReactNum.value = "";
  modalTableRow.value = "";
});

function saveSuccescc() {
  alert("성공적으로 등록 되었습니다.");
  getSelectBoxList();
}

// 상세 대응 저장
function addDetail(checkbox) {
  const tbBoxinArea = checkbox.closest(".tb-boxin-area");
  const inputArea = tbBoxinArea.querySelectorAll(".innerTable input.tb-edit");
  const reactGdArea = tbBoxinArea.querySelectorAll(".reactGd");
  const selectElement = document.getElementById("selectBox");
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  const checkBoxArea = tbBoxinArea.querySelectorAll(".innerTable .check-type");

  const selectedOptionId = selectedOption.value;
  const separatedArray = selectedOptionId.split("-");
  const firstPart = separatedArray[0]; // "DIE"
  const secondPart = separatedArray[1]; // "15"

  let id = "";

  for (let i = 0; i < reactGdArea.length; i++) {
    const thElement = reactGdArea[i];
    id = thElement.id;
  }
  // 체크박스 ID 가져오기
  for (let i = 0; i < inputArea.length; i++) {
    const inputValue = inputArea[i].value;
    const cbElement = checkBoxArea[i];
    const cboxId = cbElement.id;

    if (inputValue == "" || inputValue == null) {
      alert("상세 대응 단계 명을 추가해 주세요");
      return;
    }
    let data = "";
    // 체크박스 ID가 있으면 수정 없으면 새로 등록
    if (cboxId == null || cboxId == "") {
      data = {
        svcThemeCd: firstPart,
        statEvetCd: secondPart,
        reactGd: id,
        detail: inputValue,
        detailNum: i + 1,
      };
      console.log("id X");
    } else {
      data = {
        id: Number(cboxId),
        svcThemeCd: firstPart,
        statEvetCd: secondPart,
        reactGd: id,
        detail: inputValue,
        detailNum: i + 1,
      };
      console.log("id ㅇ");
    }

    const postUrl = "http://localhost:8080/api/detailInsert";
    console.log(data);
    postApi3(postUrl, data);
  }

  console.log("저장완료");
  alert("상세 대응이 저장 되었습니다");
  getSelectBoxList();
}

function getCheckedRowIds() {
  const checkedRows = document.querySelectorAll(
    'tr input[type="checkbox"]:checked'
  );

  const checkedRowIds = Array.from(checkedRows).map(
    (checkbox) => checkbox.closest("tr").id
  );
  return checkedRowIds;
}
