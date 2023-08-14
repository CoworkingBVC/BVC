$(document).ready(function () {
  $.ajax({
    url: "http://localhost:8081/coworker", // Replace with the actual URL
    method: "GET",
    dataType: "json", // Expected response data type
    success: function (data) {
      console.log("Data received:", data);
    },
    error: function (xhr, status, error) {
      // This function will be executed if an error occurs
      console.error("Error:", status, error);
    },
  });
});

/* console.log("Before fetch");
fetch("/coworker")
  .then((response) => response.json())
  .then((data) => {
    console.log("Fetched data:", data);
    // Rest of your code...
  })
  .catch((error) => {
    console.error("Fetch Error:", error);
  });
console.log("After fetch"); */

/* document
  .getElementById("sort-size")
  .addEventListener("click", function (event) {
    event.preventDefault();
    //fetch 추가
    try {
      //it will be sorted by the name
      let sortedArr = dataSet.sort((a, b) => {
        if (a[4] > b[4]) {
          return 1;
        } else if (a[4] < b[4]) {
          return -1;
        } else {
          return 0;
        }
      });
      //display the array sorted by salary
      DisplayArray(sortedArr);
    } catch {
      throw Error();
    }
  });

function DisplayArray(arr) {
  const PropertyContainer = document.getElementById("properties-container");

  PropertyContainer.innerHTML = "";
  arr.forEach((property) => {
    let propertyBox = document.createElement("div");
    propertyBox.innerHTML = ` <a href="/property.html">
    <img src="/images/31.jpg" class="card-img-top" />
    <div class="card-body">
      <h5 class="card-title">Property name</h5>
      <div id="property-info">
        <div class="address">${property.address}</div>
        <div class="neighborhood">${property.neighorhood}</div>
        <div class="parking">${property.hasParking}</div>
        <div class="transit">${property.transit}</div>
      </div>
      <div id="price">$50/day</div>
    </div>
  </a>`;
    PropertyContainer.appendChild(propertyBox);
  });
}
 */
