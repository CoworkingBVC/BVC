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

    workspaceBox.innerHTML = ` <button type="submit" id="workspace-box-btn" data-id=${workspace.propertyId}>
    
    <div class="card-body">
      <h5 class="card-title">workspace name</h5>
      <div id="workspace-info">
      <div id="hide-id">${workspace.propertyId}</div>
      <div id="address"><span>Address: </span>${workspace.address}</div>
      <div id="neighborhood"><span>Neighborhood: </span>${workspace.neighborhood}</div>
      <div id="squareFeet"><span>Square feet: </span>${workspace.squareFeet}</div>
        <div id="hasParking"><span>Parking: </span>${workspace.hasParking}</div>
        <div id="hasPublicTransit"><span>Public: </span>${workspace.hasPublicTransit}</div>
        <div id="type"><span>Type: </span>${workspace.type}</div>
        <div id="seats"><span>Seats: </span>${workspace.seats}</div>
        <div id="isSmokingAllowed"><span>Smoking: </span>${workspace.isSmokingAllowed}</div>
        <div id="AvailabilityStart"><span>Start Date: </span>${workspace.AvailabilityStart}</div>
        <div id="AvailabilityEnd"><span>End Date: </span>${workspace.AvailabilityEnd}</div>
        <div id="leaseTerm"><span>Lease term: </span>${workspace.leaseTerm}</div>
        <div id="price"><span>Price: $</span>${workspace.price}/${workspace.leaseTerm}</div>
      </div>
    </div>
  </button>`;
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

$(document).ready(function () {
  let workspaceBox = $("#workspaces-container");

  workspaceBox.on("click", "#workspace-box-btn", function (e) {
    let id = $("#hide-id").html();

    $.ajax({
      url: `http://localhost:8081/coworker/${id}`,
      type: "GET",
      data: id,
      success: function (result) {},
      error: function (error) {
        console.log(error);
      },
    });
  });
});
