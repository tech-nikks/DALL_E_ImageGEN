const express = require("express");
const cors = require("cors");
require("dotenv").config();
// // // const OpenAI= require("openai");
// const { HfInference } = require("@huggingface/inference");
// const generateImage = require('./imagegeneration');
const app = express();
app.use(cors());
app.use(express.json());

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

// const apiKey = process.env.OPENAI_API_KEY;

// const openai = new OpenAI(process.env.OPENAI_API_KEY);
// const generateImage = async (prompt) => {
 
//     const image = await openai.images.generate({ model: "dall-e-3", prompt: prompt, n: 1, });
//    return image;
//   console.log(image.data);
// }


//   const image = response.data.data[0].b64_json;
//   return image;
// });



// Initialize the DALL-E model


// Example function to generate an image from text
// async function generateImage(prompt) {
//     try {
//         // Generate an image based on the textual description
//         const image = await dalle.generate({ prompt });
//         return image;
//     } catch (error) {
//         console.error("Error:", error);
//         return null;
//     }
// }




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
console.log(result);
    // Extract the generated image URL from the result
    let imageBlob;
    if (result.outputs && result.outputs.length > 0) {
      for (const output of result.outputs) {
        if (output.image_blob) {
          imageBlob = output.image_blob;
          break;
        }
      }
    }

    console.log("Image Blob:", imageBlob);

    // If image blob is available, create a URL for it
    if (imageBlob) {
      const imageUrl = URL.createObjectURL(new Blob([imageBlob], { type: 'image/jpeg' }));
      console.log("Image URL:", imageUrl);
      return imageUrl;
    } else {
      console.error("No image blob found in the result");
      return null;
    }
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}
  
// app.post('/generateImage', async (req, res) => {
//   const { prompt } = req.body;

//   try {
//     const imageUrl = await generateImage(prompt);
//     if (imageUrl) {
//       res.json({ image: imageUrl });
//       res.send({ image: imageUrl });
//     } else {
//       res.status(500).json({ error: 'Failed to generate image' });
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Example description
// const description = "a cat sitting on a table";

// Call the function to generate an image
// generateImage(prompt).then((image) => {
//     if (image) {
//         // Process the generated image (e.g., display or save it)
//         console.log("Image generated successfully:", image);
//     } else {
//         console.log("Failed to generate image.");
//     }
// });


app.post("/generateImage", async (req, res) => {
  const image = await generateImage(req.body.prompt);
  res.send({ image });
});