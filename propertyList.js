// public/js/populateList.js
const propertyList = document.getElementById("propertyList");

fetch("/coworker") // Replace with your actual API endpoint
  .then((response) => response.json())
  .then((properties) => {
    console.log("fetch");
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
