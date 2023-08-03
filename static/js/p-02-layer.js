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
    //tabArea 초기화
    tabArea.innerHTML = "";

    if (jsonData.length == 0 || jsonData.length == null) {
      console.log("jsonData가 없습니다");
      return;
    }
    // 탭 생성
    for (let i = 0; i < jsonData.length; i++) {
      const liArea = document.createElement("li");
      const aArea = document.createElement("a");
      aArea.href = "#tab" + jsonData[i].reactGdNum + "-1";
      aArea.innerHTML = jsonData[i].reactGd;
      liArea.appendChild(aArea);
      tabArea.appendChild(liArea);
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
