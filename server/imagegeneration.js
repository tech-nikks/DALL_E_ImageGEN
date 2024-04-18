const { HfInference } = require("@huggingface/inference");

async function generateImage(prompt) {
  try {
    // Initialize Hugging Face Inference
    const inference = new HfInference(process.env.HF_TOKEN); // Replace with your Hugging Face token

    // Call the textToImage method to generate an image from the text
    const result = await inference.textToImage({
      model: "stabilityai/stable-diffusion-2",
      inputs: prompt,
      parameters: {
        negative_prompt: "blurry",
      },
    });

    // Extract the generated image URL from the result
    const imageUrl = result.outputs?.[0]?.image_url;

    return imageUrl;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

module.exports = generateImage;
