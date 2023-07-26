$(document).ready(function () {
  //  텝메뉴
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

  // 취소버튼
  $(".cancel-btn").click(function () {
    $(".modal-area").css("display", "none");
  });

  // 모달 x버튼 클릭시
  $(".modal-area .modal-box .x-btn").click(function () {
    $(".modal-area, .modal-box").removeClass("active");
    $("body").removeClass("active");
  });

  $(".container .modal-event-rgdt").click(function () {
    $(".modal-area, .event-rgdt").toggleClass("active");
    $("body").addClass("active");
  });
});
