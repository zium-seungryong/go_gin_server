function createPagination(jsonData) {
  console.log(jsonData);
  const paginationList = document.getElementById("pagination-list");
  paginationList.innerHTML = ""; // 이전 페이지 번호들 제거

  const totalPages = Math.ceil(jsonData.totalCount / jsonData.pageSize);
  const currentPage = jsonData.page;

  // 현재 페이지가 10개씩 묶어서 표시될 때의 그룹 번호 계산
  const currentGroup = Math.ceil(currentPage / 10);
  const startPageOfGroup = (currentGroup - 1) * 10 + 1;
  const endPageOfGroup = Math.min(currentGroup * 10, totalPages);

  // 이전 그룹으로 이동하는 버튼 추가
  if (currentGroup > 1) {
    var doublePrevButton = document.createElement("li");
    doublePrevButton.innerHTML = '<a class="double-prev"></a>';
    doublePrevButton.addEventListener("click", function () {
      jsonData.page = (currentGroup - 2) * 10 + 1;
      tableData(jsonData.page);
    });
    paginationList.appendChild(doublePrevButton);
  }

  // 이전 페이지로 이동하는 버튼 추가
  if (currentPage > 1) {
    const prevButton = document.createElement("li");
    prevButton.innerHTML = '<a class="prev"></a>';
    prevButton.addEventListener("click", function () {
      jsonData.page--;
      //   tableData(jsonData.page - 1);
      tableData(jsonData.page);
    });
    paginationList.appendChild(prevButton);
  }

  // 페이지 번호들 추가
  for (let i = startPageOfGroup; i <= endPageOfGroup; i++) {
    const pageNumberButton = document.createElement("li");
    pageNumberButton.innerHTML =
      '<a class="num' +
      (i === currentPage ? " active" : "") +
      '">' +
      i +
      "</a>";
    pageNumberButton.addEventListener("click", function (event) {
      jsonData.page = parseInt(event.target.innerText);
      console.log(event.target.innerText);
      tableData(event.target.innerText);
      //createPagination(jsonData);
    });
    paginationList.appendChild(pageNumberButton);
  }

  // 다음 페이지로 이동하는 버튼 추가
  if (currentPage < totalPages) {
    const nextButton = document.createElement("li");
    nextButton.innerHTML = '<a class="next"></a>';
    nextButton.addEventListener("click", function () {
      console.log(jsonData.page++);
      tableData(jsonData.page++);
    });
    paginationList.appendChild(nextButton);
  }

  // 다음 그룹으로 이동하는 버튼 추가
  if (currentGroup < Math.ceil(totalPages / 10)) {
    const doubleNextButton = document.createElement("li");
    doubleNextButton.innerHTML = '<a class="double-next"></a>';
    doubleNextButton.addEventListener("click", function () {
      jsonData.page = currentGroup * 10 + 1;
      console.log((jsonData.page = currentGroup * 10 + 1));
      //   tableData(currentGroup * 10 + 1);
      tableData(jsonData.page);
    });
    paginationList.appendChild(doubleNextButton);
  }
}
