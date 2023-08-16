//GET all workspaces
$(document).ready(function () {
  $.ajax({
    url: "http://localhost:8081/coworker",
    method: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      DisplayWorkspace(data);
      localStorage.setItem("workspacesInfo", JSON.stringify(data));
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
  let workspaceId = 0;
  data.result.forEach((workspace) => {
    let workspaceBox = document.createElement("div");
    //console.log(workspace);
    workspaceBox.setAttribute("id", "workspace-box");
    workspaceBox.setAttribute("class", "card");
    workspaceBox.innerHTML = `
      <div id="hide-id">${workspace.propertyId}</div>
      <div class="address"><span>Address: </span>${workspace.address}</div>
      <div class="neighborhood"><span>Neighborhood: </span>${workspace.neighborhood}</div>
      <div class="squareFeet"><span>Square feet: </span>${workspace.squareFeet}</div>
      <div class="hasParking"><span>Parking: </span>${workspace.hasParking}</div>
      <div class="hasPublicTransit"><span>Public: </span>${workspace.hasPublicTransit}</div>
      <div class="type"><span>Type: </span>${workspace.type}</div>
      <div class="seats"><span>Seats: </span>${workspace.seats}</div>
      <div class="isSmokingAllowed"><span>Smoking: </span>${workspace.isSmokingAllowed}</div>
      <div class="AvailabilityStart"><span>Start Date: </span>${workspace.AvailabilityStart}</div>
      <div class="AvailabilityEnd"><span>End Date: </span>${workspace.AvailabilityEnd}</div>
      <div class="leaseTerm"><span>Lease term: </span>${workspace.leaseTerm}</div>
      <div class="price"><span>Price: $</span>${workspace.price}/${workspace.leaseTerm}</div>
      <button id ="workspace-box-btn" class="btn btn-primary" data-id=${workspace.propertyId} data-type = ${workspaceId}>Get Info</button>
    `;
    PropertyContainer.appendChild(workspaceBox);
    workspaceId++;
  });
}

//Sort
function Sort(event) {
  const btnId = event.target.id;

  const workspaces = JSON.parse(localStorage.getItem("workspacesInfo")).result;
  if (btnId === "sort-price") {
    workspaces.sort((a, b) => a.price - b.price);
  } else if (btnId === "sort-size") {
    workspaces.sort((a, b) => a.squareFeet - b.squareFeet);
  }
  let sortData = { result: workspaces };
  DisplayWorkspace(sortData);
}

//Search
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
        DisplayWorkspace(result);
        localStorage.setItem("workspacesInfo", JSON.stringify(result));
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});

//get owner info
$(document).ready(function () {
  let workspaceContainer = $("#workspaces-container");
  workspaceContainer.on("click", "#workspace-box-btn", function (e) {
    let id = $(this).data("id");
    let worksapceId = $(this).data("type");
    console.log(worksapceId);
    $.ajax({
      url: `http://localhost:8081/coworker/${id}`,
      type: "GET",
      data: id,
      success: function (data) {
        localStorage.setItem("userInfo", JSON.stringify(data.result));
        const workspacesInfo = JSON.parse(
          localStorage.getItem("workspacesInfo")
        );
        console.log(workspacesInfo);
        localStorage.setItem(
          "workspaceInfo",
          JSON.stringify(workspacesInfo.result[worksapceId])
        );
        window.location.href = "property.html";
      },
      error: function (error) {
        console.log(error);
      },
    });
  });
});
