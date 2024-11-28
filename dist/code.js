"use strict";
figma.showUI(__html__, { width: 300, height: 400 });
figma.ui.onmessage = async (message) => {
    console.log("Received message:", message); // Log the received message
    if (message.type === "submit") {
        const { headlineEn } = message.data;
        // Find the text node by name (update this logic if necessary)
        const headlineNode = figma.currentPage.findAll((node) => node.name === "Headline EN");
        if (headlineNode && headlineNode.type === "TEXT") {
            try {
                // Ensure the font is loaded before setting the text
                await figma.loadFontAsync({
                    family: "Human BBY Digital",
                    style: "Bold",
                });
                headlineNode.characters = headlineEn; // Set the text after loading the font
            }
            catch (error) {
                figma.notify("Error loading font: " + error.message);
                console.error("Font loading error:", error);
            }
        }
        else {
            figma.notify("Headline node not found.");
        }
    }
};
