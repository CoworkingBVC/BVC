document.addEventListener("DOMContentLoaded", () => {
  const propertyContainer = document.getElementById("properties-container");

  fetch("/coworker", {
    method: "GET",
  })
    .then((response) => {
      response.json();
    })
    .then((data) => {
      console.log(data);

      /*         if (data.status === "success") {
          const propertyList = data.result;

          const propertyHtml = propertyList.map((property) => {
            return `
                <div id="property-box" class="card">
                  <a href="/property.html">
                    <img src="/images/31.jpg" class="card-img-top" />
                    <div class="card-body">
                      <h5 class="card-title">${property.name}</h5>
                      <div id="property-info">
                        <div class="address">${property.address}</div>
                        <div class="neighborhood">${property.neighborhood}</div>
                        <div class="parking">${property.parking}</div>
                   å     <div class="transit">${property.transit}</div>
                      </div>
                      <div id="price">$${property.price}/day</div>
                    </div>
                  </a>
                </div>
              `;
          });

          propertyContainer.html(propertyHtml.join(""));
        } */
    })
    .catch((error) => {
      console.error("Error", error);
    });
});
