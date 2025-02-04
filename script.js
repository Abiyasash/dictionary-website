const dictionaryForm = document.querySelector(".dictionaryForm");
const clearBtn = document.querySelector(".clearBtn");
const wordInput = document.querySelector(".wordInput");
const resultCard = document.querySelector(".resultCard");

dictionaryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const word = wordInput.value;

  if (word) {
    try {
      const wordData = await getWordData(word);
      displayWordData(wordData);
    } catch (error) {
      displayError(error);
    }
  } else {
    displayError("Please enter a word.");
  }

  wordInput.value = "";
});

async function getWordData(word) {
  const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Could not fetch word data.");
  }

  return await response.json();
}

function displayWordData(data) {
  resultCard.textContent = "";
  resultCard.style.display = "flex";
  resultCard.style.flexDirection = "column";

  const wordDisplay = document.createElement("h1");

  let phonetics = [];
  data.forEach((section) => {
    section.phonetics.forEach((phonetic) => {
      phonetics.push(phonetic.text);
    });
  });

  phonetics = [...new Set(phonetics)];

  if (phonetics.length !== 0) {
    wordDisplay.textContent = data[0].word + ` ${phonetics.join(", ")} `;
  } else {
    wordDisplay.textContent = data[0].word;
  }

  wordDisplay.classList.add("wordDisplay");
  resultCard.append(wordDisplay);

  let seenPhoneticAudios = new Set();

  let audioCounter = 1;

  data.forEach((section) => {
    section.phonetics.forEach((phonetic) => {
      if (phonetic.audio && !seenPhoneticAudios.has(phonetic.audio)) {
        const phoneticLinkDisplay = document.createElement("a");
        phoneticLinkDisplay.href = phonetic.audio;
        phoneticLinkDisplay.target = "_blank";
        phoneticLinkDisplay.textContent = `Audio #${audioCounter}`;
        phoneticLinkDisplay.classList.add("phoneticDisplay");
        resultCard.append(phoneticLinkDisplay);

        seenPhoneticAudios.add(phonetic.audio);
        audioCounter++;
      }
    });
  });

  data.forEach((section) => {
    section.meanings.forEach((meaning) => {
      const partOfSpeechDisplay = document.createElement("p");
      partOfSpeechDisplay.textContent = meaning.partOfSpeech;
      partOfSpeechDisplay.classList.add("partOfSpeechDisplay");
      partOfSpeechDisplay.style.fontStyle = "italic";
      partOfSpeechDisplay.style.fontWeight = "700";
      resultCard.append(partOfSpeechDisplay);
      resultCard.appendChild(document.createElement("br"));

      const definitionsListDisplay = document.createElement("ul");
      definitionsListDisplay.textContent = "";

      meaning.definitions.forEach((definition) => {
        const definitionDisplay = document.createElement("li");
        definitionDisplay.textContent = definition.definition;
        definitionDisplay.classList.add("defDisplay");
        definitionsListDisplay.appendChild(definitionDisplay);

        definitionsListDisplay.appendChild(document.createElement("br"));

        const exampleDisplay = document.createElement("p");
        exampleDisplay.textContent = `"${definition.example}"`;
        if (!definition.example) {
          exampleDisplay.textContent = "";
        }
        if (definition.example) {
          exampleDisplay.classList.add("exampleDisplay");
        }
        definitionsListDisplay.appendChild(exampleDisplay);

        if (definition.example) {
          definitionsListDisplay.appendChild(document.createElement("br"));
        }
      });

      if (meaning.synonyms.length !== 0) {
        const synonymsDisplay = document.createElement("p");
        synonymsDisplay.textContent = `Synonyms: ${meaning.synonyms.join(
          ", "
        )}`;
        synonymsDisplay.classList.add("synonymsDisplay");
        definitionsListDisplay.appendChild(synonymsDisplay);
      }

      if (meaning.antonyms.length !== 0) {
        const antonymsDisplay = document.createElement("p");
        antonymsDisplay.textContent = `Antonyms: ${meaning.antonyms.join(
          ", "
        )}`;
        antonymsDisplay.classList.add("antonymsDisplay");
        definitionsListDisplay.appendChild(antonymsDisplay);
      }

      resultCard.appendChild(definitionsListDisplay);
    });
  });
}

function displayError(msg) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = msg;
  errorDisplay.classList.add("errorDisplay");

  resultCard.textContent = "";
  resultCard.style.display = "flex";
  resultCard.style.justifyContent = "center";
  resultCard.appendChild(errorDisplay);
}

clearBtn.addEventListener("click", (event) => {
  event.preventDefault();

  resultCard.textContent = "";
  resultCard.style.display = "none";
});
