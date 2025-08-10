import jsonData from "./text.json";

export default function generateParagraph(
  language: string,
  para_length: number
) {
  if (!(language in jsonData)) {
    return {
      message: "Please select a given language",
      message_type: "error",
      text_array: [],
      status: 401,
    };
  }
  const text_pool = jsonData[language as keyof typeof jsonData];
  const text_array = [];
  let capitalize = false;
  let random_number = randomIntFromInterval(0, text_pool.length - 1);
  let i: number = 0;
  for (i; i <= para_length; i++) {
    text_array.push(
      capitalize
        ? capitalizeFirstLetter(text_pool[random_number])
        : text_pool[random_number]
    );
    capitalize = false;
    const new_random_number = randomIntFromInterval(0, text_pool.length - 1);
    if (new_random_number == random_number) {
      if (random_number - 1 >= text_pool.length - 1 - random_number) {
        random_number = randomIntFromInterval(0, random_number - 1);
      } else {
        random_number = randomIntFromInterval(
          random_number + 1,
          text_pool.length - 1
        );
      }
    } else {
      random_number = new_random_number;
    }
    if (random_number % 17 == 0) {
      capitalize = true;
    }
  }

  return {
    message: "successfully generated paragraph",
    message_type: "success",
    text_array: text_array,
    status: 200,
  };
}

// Generates random number between a given range
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to capitalize first letter
function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
