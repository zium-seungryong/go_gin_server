// 전체 체크 및 해제

function AllCheck(AllCheckId, checkBoxClass) {
  const checkbox = document.getElementById(AllCheckId); //전체 선택 체크 박스 id

  checkbox.addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(checkBoxClass); //선택되야 하는 체크 박스 class
    for (let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = checkbox.checked;
    }
  });
}

// 체크된 리스트
function CheckList(AllCheckId, checkBoxClass) {
  const checkboxes = document.querySelectorAll(checkBoxClass);
  let checkedIds = [];
  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      checkedIds.push(checkboxes[i].id);
    }
  }
  // 전체 선택 체크 박스 id 목록에서 제거

  checkArray = checkedIds.filter(function (item) {
    return item !== AllCheckId;
  });

  return checkArray;
}
