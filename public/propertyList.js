$(document).ready(function () {
  $.ajax({
    url: "http://localhost:8081/coworker", // Replace with the actual URL
    method: "GET",
    dataType: "json", // Expected response data type
    success: function (data) {
      console.log("Data received:", data);
      DisplayPropertyList(data);
    },
    error: function (xhr, status, error) {
      // This function will be executed if an error occurs
      console.error("Error:", status, error);
    },
  });
});

//Display properties
function DisplayPropertyList(data) {
  const PropertyContainer = document.getElementById("properties-container");

  PropertyContainer.innerHTML = "";
  data.result.forEach((property) => {
    let propertyBox = document.createElement("div");

    propertyBox.setAttribute("id", "property-box");
    propertyBox.setAttribute("class", "card");

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

//Sort by size

//Search by address, nei, size, parking, public, trans,
