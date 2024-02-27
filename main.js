
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const closeButton = document.getElementById("closeButton");

    // Function to show the popup
    const showPopup = () => {
        popup.classList.add("show");
    };

    // Function to hide the popup
    const hidePopup = () => {
        popup.classList.remove("show");
    };

    // Show the popup after 5 seconds
    setTimeout(showPopup, 2000);

    closeButton.addEventListener("click", () => {
        hidePopup();
    });
});




