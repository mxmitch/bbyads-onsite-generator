"use strict";
document.getElementById("inputForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const headlineEn = document.getElementById("headline-en").value;
    parent.postMessage({ pluginMessage: { type: "submit", data: { headlineEn } } }, "*");
});
