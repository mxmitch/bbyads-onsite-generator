figma.showUI(__html__, { width: 300, height: 400 });

figma.ui.onmessage = async (message) => {
  if (message.type === "submit") {
    try {
      // Find all text nodes for English and French headlines
      const englishHeadlineNodes = figma.currentPage.findAll((node) => {
        return node.type === "TEXT" && node.name.includes("Headline EN");
      });

      const frenchHeadlineNodes = figma.currentPage.findAll((node) => {
        return node.type === "TEXT" && node.name.includes("Headline FR");
      });

      if (
        englishHeadlineNodes.length === 0 &&
        frenchHeadlineNodes.length === 0
      ) {
        figma.notify("No headline nodes found.");
        return;
      }

      // Load fonts
      await figma.loadFontAsync({ family: "Human BBY Digital", style: "Bold" });

      // Update English headlines
      englishHeadlineNodes.forEach((node) => {
        node.characters = message.data.headlineEn; // Update with the English headline
      });

      // Update French headlines
      frenchHeadlineNodes.forEach((node) => {
        node.characters = message.data.headlineFr; // Update with the French headline
      });

      figma.notify("Headlines updated!");
    } catch (error) {
      figma.notify(`Error: ${error.message}`);
      console.error("Error updating headlines:", error);
    }
  }
};
