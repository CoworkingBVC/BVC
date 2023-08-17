(function () {
    window.utilities = window.utilities || {};
    utilities.getOwnerId = function () { 
        return  JSON.parse(localStorage.getItem("user")).id;
     };
})();