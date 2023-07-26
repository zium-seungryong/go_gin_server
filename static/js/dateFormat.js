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
