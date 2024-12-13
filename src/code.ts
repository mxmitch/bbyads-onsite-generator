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

// Find frames containing a specific ID in their name
function findFramesContainingId(id: string): FrameNode[] {
  return figma.currentPage.findAll(
    (node) => node.type === "FRAME" && node.name.includes(id)
  ) as FrameNode[];
}

// Find instances by their name
function findInstancesByName(instanceName: string): InstanceNode[] {
  return figma.currentPage.findAll(
    (node) => node.type === "INSTANCE" && node.name === instanceName
  ) as InstanceNode[];
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
    // console.log(
    //   `Updated text for ${node.name} to "${text}" with font ${fontFamily} ${fontStyle}`
    // );
  } catch (error) {
    console.error(`Error updating text for ${node.name}:`, error);
  }
}

// Function to update an image node
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

    node.fills = [
      {
        type: "IMAGE",
        scaleMode: "FIT",
        imageHash: image.hash,
      },
    ];
    // console.log(`Updated image for node ${node.name} with URL ${imageUrl}`);
  } catch (error) {
    console.error(`Error updating image for node ${node.name}:`, error);
  }
}

// Main plugin logic
figma.showUI(__html__, { width: 400, height: 300 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "file-data") {
    try {
      const { format, data } = msg;
      console.log(`Received ${format} data:`, data);

      // Process the data (common logic for both Excel and JSON)
      for (const ad of data) {
        console.log("Processing ad:", ad);

        if (!ad.id) {
          console.error("Ad ID is missing or undefined:", ad);
          continue; // Skip invalid ads
        }

        // Find all matching frames and instances
        const matchingFrames = findFramesContainingId(ad.id);
        const matchingInstances = findInstancesByName(ad.id);

        if (matchingFrames.length === 0 && matchingInstances.length === 0) {
          console.error(`No frames or instances found containing ID: ${ad.id}`);
          continue;
        }

        // console.log(
        //   `Found ${matchingFrames.length} frames and ${matchingInstances.length} instances for ID: ${ad.id}`
        // );

        // Update frames
        for (const frame of matchingFrames) {
          const childFrames = findAllChildFrames(frame);
          for (const childFrame of childFrames) {
            await processFrameContent(childFrame, ad);
          }
        }

        // Update instances
        for (const instance of matchingInstances) {
          const childFrames = findAllChildFrames(instance);
          for (const childFrame of childFrames) {
            await processFrameContent(childFrame, ad);
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

// Helper function to process content updates for a given frame or instance
async function processFrameContent(frame: FrameNode, ad: any) {
  // Update headline (English)
  const headlineNodeEN = frame.findOne(
    (node) => node.name === "headlineEN" && node.type === "TEXT"
  ) as TextNode;
  if (headlineNodeEN) {
    await updateTextNode(
      headlineNodeEN,
      ad.headlineEN,
      "Human BBY Digital",
      "Bold"
    );
  }

  // Update subheadline (English)
  const subheadlineNodeEN = frame.findOne(
    (node) => node.name === "subheadlineEN" && node.type === "TEXT"
  ) as TextNode;
  if (subheadlineNodeEN) {
    await updateTextNode(
      subheadlineNodeEN,
      ad.subheadlineEN,
      "Human BBY Digital",
      "Regular"
    );
  }

  // Update fineprint (English)
  const fineprintNodeEN = frame.findOne(
    (node) => node.name === "fineprintEN" && node.type === "TEXT"
  ) as TextNode;
  if (fineprintNodeEN) {
    await updateTextNode(
      fineprintNodeEN,
      ad.fineprintEN,
      "Human BBY Digital",
      "Regular"
    );
  }

  // Update CTA button (English)
  const ctaNodeEN = frame.findOne(
    (node) => node.name === "ctaEN" && node.type === "TEXT"
  ) as TextNode;
  if (ctaNodeEN) {
    await updateTextNode(ctaNodeEN, ad.ctaEN, "Human BBY Digital", "Medium");
  }

  // Update Text Link (English)
  const textlinkNodeEN = frame.findOne(
    (node) => node.name === "textlinkEN" && node.type === "TEXT"
  ) as TextNode;
  if (textlinkNodeEN) {
    await updateTextNode(
      textlinkNodeEN,
      ad.textlinkEN,
      "Human BBY Digital",
      "Bold"
    );
  }

  // Update headline (French)
  const headlineNodeFR = frame.findOne(
    (node) => node.name === "headlineFR" && node.type === "TEXT"
  ) as TextNode;
  if (headlineNodeFR) {
    await updateTextNode(
      headlineNodeFR,
      ad.headlineFR,
      "Human BBY Digital",
      "Bold"
    );
  }

  // Update subheadline (French)
  const subheadlineNodeFR = frame.findOne(
    (node) => node.name === "subheadlineFR" && node.type === "TEXT"
  ) as TextNode;
  if (subheadlineNodeFR) {
    await updateTextNode(
      subheadlineNodeFR,
      ad.subheadlineFR,
      "Human BBY Digital",
      "Regular"
    );
  }

  // Update fineprint (French)
  const fineprintNodeFR = frame.findOne(
    (node) => node.name === "fineprintFR" && node.type === "TEXT"
  ) as TextNode;
  if (fineprintNodeFR) {
    await updateTextNode(
      fineprintNodeFR,
      ad.fineprintFR,
      "Human BBY Digital",
      "Regular"
    );
  }

  // Update CTA button (French)
  const ctaNodeFR = frame.findOne(
    (node) => node.name === "ctaFR" && node.type === "TEXT"
  ) as TextNode;
  if (ctaNodeFR) {
    await updateTextNode(ctaNodeFR, ad.ctaFR, "Human BBY Digital", "Medium");
  }

  // Update Image
  const imageNode = frame.findOne(
    (node) => node.name === "image" && node.type === "RECTANGLE"
  ) as RectangleNode;
  if (imageNode) {
    await updateImageNode(imageNode, ad.imageUrl);
  }
}
