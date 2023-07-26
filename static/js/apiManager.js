// get api
function getApi(url, callback) {
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
      callback(data);
    })
    .catch(function (error) {
      console.log("ajax error:", error);
    });
}

// get api2
function getApi2(url, data, callback) {
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      callback(data);
    })
    .catch(function (error) {
      console.log("ajax error:", error);
    });
}

// post api
// function postApi(url, data, callback) {
//   fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((response) => response.json())
//     .then((responseData) => {
//       if (responseData.ok == true) {
//         console.log(responseData);
//         callback(data);
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

function postApi(url, data, callback) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((responseData) => {
      console.log(responseData);
      if (callback) {
        callback(responseData); // 응답에 성공한 후 콜백 함수 실행
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// post api
function postApi2(url, data, callback) {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        return response.text(); // 응답 데이터를 텍스트 형식으로 반환
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .then((responseText) => {
      if (responseText === "OK") {
        callback(data);
      } else {
        console.error("Response was not OK");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
