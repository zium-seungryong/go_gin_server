function formatDateTime1(dateTimeString) {
  const year = dateTimeString.slice(0, 4);
  const month = dateTimeString.slice(4, 6);
  const day = dateTimeString.slice(6, 8);
  const hour = dateTimeString.slice(8, 10);
  const minute = dateTimeString.slice(10, 12);
  const second = dateTimeString.slice(12, 14);

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
}
// 현재시각
function nowDtm() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}
