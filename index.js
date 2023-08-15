// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          // Fetch user info from the form and then call the postInfo function
          const userinfo = {
            email: $("#email").val(),
            password: $("#password").val(),
            phoneNumber: $("#phoneNumber").val(),
            role: $("#role").val(),
          };
          postInfo(userinfo);
          showalert();
          // location.replace("https://www.w3schools.com");
        }

        // Mark the form as validated, applying Bootstrap styles
        form.classList.add("was-validated");
      },
      false
    );
  });
  const date = new Date();
  let year = date.getFullYear();
  const newFooterContent = `<p class="mb-1">&copy; ${year} BVC CoWork</p>`;

  $("#myFooter").html(newFooterContent);
})();

function postInfo(userinfo) {
  const serverURL = "http://localhost:8081/register";

  $.post(serverURL, userinfo)
    .done((response) => {
      console.log("Server response:", response);
    })
    .fail((error) => {
      console.error("Error:", error);
    });
}

function showalert() {
  alert("Registration Successful!");
}
