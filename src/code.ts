// Recursive function to find all child frames within a parent node
function findAllChildFrames(node: SceneNode): FrameNode[] {
  const childFrames: FrameNode[] = [];

  if (node.type === "FRAME") {
    childFrames.push(node); // Include the current node if it's a frame
  }

  if ("children" in node) {
    for (const child of node.children) {
      childFrames.push(...findAllChildFrames(child)); // Recursively find child frames
    }
  }

  return childFrames;
}

function findFramesContainingId(id: string): FrameNode[] {
  return figma.currentPage.findAll(
    (node) => node.type === "FRAME" && node.name.includes(id)
  ) as FrameNode[];
}

// Function to load font and update a text node
async function updateTextNode(
  node: TextNode,
  text: string,
  fontFamily: string,
  fontStyle: string
) {
  if (typeof text !== "string" || text.trim() === "") {
    console.error(`Invalid text value for node ${node.name}:`, text);
    return; // Skip updating this node
  }

  try {
    await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
    node.characters = text;
    console.log(
      `Updated text for ${node.name} to "${text}" with font ${fontFamily} ${fontStyle}`
    );
  } catch (error) {
    console.error(`Error updating text for ${node.name}:`, error);
  }
}

async function updateImageNode(node: RectangleNode, imageUrl: string) {
  try {
    if (!imageUrl) {
      console.error("Invalid image URL:", imageUrl);
      return;
    }

    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
    }

    const imageBytes = await response.arrayBuffer();
    const image = figma.createImage(new Uint8Array(imageBytes));

    // Set the image as the fill of the node
    node.fills = [
      {
        type: "IMAGE",
        scaleMode: "FIT",
        imageHash: image.hash,
      },
    ];
    console.log(`Updated image for node ${node.name} with URL ${imageUrl}`);
  } catch (error) {
    console.error(`Error updating image for node ${node.name}:`, error);
  }
}

// Main plugin logic
figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "update-ads") {
    try {
      const adsData = msg.ads;
      console.log("Ads data received:", adsData);

      for (const ad of adsData) {
        console.log("Processing ad:", ad);

        if (!ad.id) {
          console.error("Ad name is missing or undefined:", ad);
          continue; // Skip invalid ads
        }

        // Find all frames containing the ad ID in their name
        const matchingFrames = findFramesContainingId(ad.id);

        if (matchingFrames.length === 0) {
          console.error(`No frames found containing ID: ${ad.id}`);
          continue;
        }

        console.log(
          `Found ${matchingFrames.length} frames with name: ${ad.id}`
        );

        for (const frame of matchingFrames) {
          // Find all child frames within the current frame
          const childFrames = findAllChildFrames(frame);

          console.log(
            `Found ${childFrames.length} child frames in ${frame.name}`
          );

          for (const childFrame of childFrames) {
            // Update headline (English)
            const headlineNode = childFrame.findOne(
              (node) => node.name === "headlineEN" && node.type === "TEXT"
            ) as TextNode;
            if (headlineNode) {
              await updateTextNode(
                headlineNode,
                ad.headlineEN,
                "Human BBY Digital",
                "Bold"
              );
            } else {
              console.log("Headline node not found in frame:", childFrame.name);
            }

            // Update subheadline (English)
            const subheadlineNode = childFrame.findOne(
              (node) => node.name === "subheadlineEN" && node.type === "TEXT"
            ) as TextNode;
            if (subheadlineNode) {
              await updateTextNode(
                subheadlineNode,
                ad.subheadlineEN,
                "Human BBY Digital",
                "Regular"
              );
            } else {
              console.log(
                "Subheadline node not found in frame:",
                childFrame.name
              );
            }

            // Update headline (French)
            const headlineNodeFR = childFrame.findOne(
              (node) => node.name === "headlineFR" && node.type === "TEXT"
            ) as TextNode;
            if (headlineNodeFR) {
              await updateTextNode(
                headlineNode,
                ad.headlineFR,
                "Human BBY Digital",
                "Bold"
              );
            } else {
              console.log("Headline node not found in frame:", childFrame.name);
            }

            // Update subheadline (French)
            const subheadlineNodeFR = childFrame.findOne(
              (node) => node.name === "subheadlineFR" && node.type === "TEXT"
            ) as TextNode;
            if (subheadlineNodeFR) {
              await updateTextNode(
                subheadlineNode,
                ad.subheadlineFR,
                "Human BBY Digital",
                "Regular"
              );
            } else {
              console.log(
                "Subheadline node not found in frame:",
                childFrame.name
              );
            }

            // Update image frame
            const imageNode = childFrame.findOne(
              (node) => node.name === "image" && node.type === "RECTANGLE"
            ) as RectangleNode;
            if (imageNode) {
              await updateImageNode(imageNode, ad.imageUrl); // Ensure `ad.imageUrl` is passed in your JSON
            } else {
              console.log("Image node not found in frame:", childFrame.name);
            }
          }
        }
      }

      figma.notify("Ads updated successfully!");
    } catch (error) {
      console.error("Error updating ads:", error);
      figma.notify(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
};
