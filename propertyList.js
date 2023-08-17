//GET all workspaces
$(document).ready(function () {
  $.ajax({
    url: "http://localhost:8081/coworker",
    method: "GET",
    dataType: "json",
    success: function (data) {
      console.log("1", data);
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
    <div class="card text-center" style="width: 25rem;">
      <div class="card-body">
        <h5>Property Information</h5>
        <p class="card-text">Address: ${workspace.address}</p>
        <p class="card-text">Neighborhood: ${workspace.neighborhood}</p>
        <p class="card-text">Square feet: ${workspace.squareFeet}</p>
        <p class="card-text">Parking: ${workspace.hasParking ? "✅" : "❌"}</p>
        <p class="card-text">Public Transit: ${
          workspace.hasPublicTransit ? "✅" : "❌"
        }</p>
        <h5>Workspace Information</h5>
        <p class="card-text">Type: ${workspace.type}</p>
        <p class="card-text">Seats: ${workspace.seats}</p>
        <p class="card-text">Smoking: ${
          workspace.isSmokingAllowed ? "✅" : "❌"
        }</p>
        <p class="card-text">Start Date: ${workspace.availabilityStart}</p>
        <p class="card-text">End Date: ${workspace.availabilityEnd}</p>
        <p class="card-text">Lease term: ${workspace.leaseTerm}</p>
        <p class="card-text">Price: $${workspace.price}/${
      workspace.leaseTerm
    }</p>
        <button id ="workspace-box-btn" class="btn btn-primary" data-id=${
          workspace.propertyId
        } data-type = ${workspaceId}>Get Info</button>
      </div>
    </div>
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
