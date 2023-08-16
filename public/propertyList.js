$(document).ready(function () {
  $.ajax({
    url: "http://localhost:8081/coworker", // Replace with the actual URL
    method: "GET",
    dataType: "json", // Expected response data type
    success: function (data) {
      console.log("Data received:", data);
      DisplayWorkspace(data);
    },
    error: function (xhr, status, error) {
      console.error("Error:", status, error);
    },
  });
});

//Display workspace
function DisplayWorkspace(data) {
  const PropertyContainer = document.getElementById("workspaces-container");

  PropertyContainer.innerHTML = "";
  data.result.forEach((workspace) => {
    let workspaceBox = document.createElement("div");

    workspaceBox.setAttribute("id", "workspace-box");
    workspaceBox.setAttribute("class", "card");

    workspaceBox.innerHTML = ` <a href="/workspace.html">
    <img src="/images/31.jpg" class="card-img-top" />
    <div class="card-body">
      <h5 class="card-title">workspace name</h5>
      <div id="workspace-info">
        <div class="address">${workspace.address}</div>
        <div class="neighborhood">${workspace.neighborhood}</div>
        <div class="transit">${workspace.squareFeet}</div>
        <div class="parking">${workspace.hasParking}</div>
        <div class="transit">${workspace.hasPublicTransit}</div>
        <div class="transit">${workspace.type}</div>
        <div class="transit">${workspace.seats}</div>
        <div class="transit">${workspace.isSmokingAllowed}</div>
        <div class="transit">${workspace.AvailabilityStart}</div>
        <div class="transit">${workspace.AvailabilityEnd}</div>
        <div class="transit">${workspace.leaseTerm}</div>
        <div class="transit">${workspace.price}</div>
      </div>
      <div id="price">$50/day</div>
    </div>
  </a>`;
    PropertyContainer.appendChild(workspaceBox);
  });
}

//Sort by size

//Search by address, nei, size, parking, public...

$(function () {
  $("form#search-form").on("submit", function (e) {
    e.preventDefault();

    var searchData = {
      address: $("input#address").val(),
      neighborhood: $("input#neighborhood").val(),
      squareFeetMin: $("input#square-feet-min").val(),
      squareFeetMax: $("input#square-feet-max").val(),
      hasParking: $("input#has-parking").is(":checked"),
      hasPublicTransit: $("input#has-public-transit").is(":checked"),
      isSmokingAllowed: $("input#is-smoking-allowed").is(":checked"),
      seats: $("input#seats").val(),
      availabilityStart: $("input#availability-start").val(),
      availabilityEnd: $("input#availability-end").val(),
      priceMin: $("input#price-min").val(),
      priceMax: $("input#price-max").val(),
    };

    $.ajax({
      url: "http://localhost:8081/search",
      type: "GET",
      data: searchData,
      success: function (result) {
        console.log("이 데이터를 처리한다", result);
        DisplayWorkspace(result);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});
