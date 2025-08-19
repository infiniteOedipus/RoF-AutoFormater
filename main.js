const prefixToClass = {
  '//': "bugging", 
  GA: "Vessta",
  UG: "Markor",
  TA: "Phenix",
  GG: "Zeaque",
};
const characterToUsername = {
  Vessta: "giddyAbsurdism [GA]",
  Markor: "udderlyGenial [UG]",
  Phenix: "terminalAeviternity [TA]",
  Zeaque: "gallantGrouser [GG]",
};
const characterToStatus = {
  Vessta: "shun th3 nonb3li3v3r",
  Markor: "gone fishing",
  Phenix: "witches ain't shit.",
  Zeaque: "busy gaming",
};
const characterToStatusImg = {
  Vessta: "Jovial",
  Markor: "Malicious",
  Phenix: "Angry",
  Zeaque: "Normal",
};

const formatingLogs = {
  "giddyAbsurdism [GA]": `<span class="Vessta">giddyAbsurdism [GA]</span>`,
  "udderlyGenial [UG]": `<span class="Markor">udderlyGenial [UG]</span>`,
  "terminalAeviternity [TA]": `<span class="Phenix">terminalAeviternity [TA]</span>`,
  "gallantGrouser [GG]": `<span class="Zeaque">gallantGrouser [GG]</span>`,
};

const trollRadios = document.querySelectorAll('input[name="chatProfile"]');

trollRadios.forEach((trollRadio) => {
  trollRadio.addEventListener("change", function () {
    if (this.checked) {
      document.getElementById("statusMessage").value =
        characterToStatus[this.value];
    }
  });
});

function parseDialogueToHTML(rawText) {
  const selectedTheme = document.querySelector(
    'input[name="chatTheme"]:checked'
  );
  if (!selectedTheme) {
    alert("Please select a theme first.");
    return "";
  }
  let selectedPFP = null;
  let selectedTroll = null;
  let selectedUsername = null;
  let selectedStatusImg = null;
  const messenger = document.querySelector('input[name="chatProfile"]:checked');
  if (!messenger) {
    alert("Please select who is being messaged.");
    return "";
  }
  if (messenger.value == "otherProfile") {
    selectedPFP = document.getElementById("otherProfileImage").value;
    selectedTroll = document.getElementById("otherUsername").value;
    selectedUsername = "default";
  }
  if (messenger.value != "otherProfile") {
    selectedPFP = `https://file.garden/Z49oqnj5okOfzefL/bugchat_PFP/${messenger.value}PFP.gif`;
    selectedTroll = messenger.value;
    selectedUsername = characterToUsername[messenger.value] || null;
    selectedStatusImg = characterToStatusImg[messenger.value] || null;
  }
  const statusMessage = document.getElementById("statusMessage").value;
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .map((line) => {
      const match = line.match(/^(([A-Z]|\/){2}):(.)(.+$)/);
      let msgClass = null;
      let displayText = line
      if (match) {
        const prefix = match[1];
        console.log(match)
        msgClass = prefixToClass[prefix] || null;

        if (msgClass === "bugging") {
          displayText = match[4]
        }
      }
      return { text: displayText, className: msgClass };
    });
  console.log("Parsed lines:", lines);

  const proccessedLines = []
  lines.forEach((line) => {
    const proccessIndex = proccessedLines.length - 1

    if (line.className) {
      proccessedLines.push(line)
      return
    }
    
    proccessedLines[proccessIndex].text += `
${line.text}`
  })

  let htmlResult = "";

  if (selectedTheme.value == "zeaqueTheme") {
    htmlResult += `<div class="zeaquetheme"><input id="check01" type="checkbox" name="Buglog" /><div class="buglog"><label for="check01"><div class="bugHeader"><div class="bugPFP"><img src="${selectedPFP}"></div><div class="bugName"><span class="${selectedTroll}">${selectedUsername}</span></div><div class="togglePrompt"></div><div class="bugStatus">${statusMessage}</div></div></label><div class="bugBody">
`;
    lines.forEach((line) => {
      if (line.className) {
        htmlResult += `<span class="${line.className}">${line.text}</span>
`;
      } else {
        // “find and replace” usernames here:
        let modified = line.text;

        // For each username key, replace every occurrence with its <span>…</span> HTML
        Object.keys(formatingLogs).forEach((username) => {
          if (modified.includes(username)) {
            const replacement = formatingLogs[username];
            // split/join replaces all literal occurrences of “username”
            modified = modified.split(username).join(replacement);
          }
        });

        // Append the fully‐replaced line (with embedded <span> tags) to htmlResult
        htmlResult += `${modified}
`;
      }
    });
    htmlResult += `</div></div></div>`;
    console.log(htmlResult);
  }
  if (selectedTheme.value == "vesstaTheme") {
    htmlResult += `<div class="vesstatheme"><input class="chatToggle" id="check01" type="checkbox" name="Buglog" /><div class="buglog"><label for="check01"><div class="bugToolbar"><div></div><div></div><div></div></div><div class="bugHeader ${selectedTroll}"><div class="bugPFP"><img src="${selectedPFP}"/></div><div class="headerBody ${selectedTroll}"><div class="bugName">${selectedUsername}</div><div class="togglePrompt"></div><div class="bugStatus"><img src="https://file.garden/Z49oqnj5okOfzefL/CSS/bugcordStatus${selectedStatusImg}.png">${statusMessage}</div></div></div></label><div class="bugBody">
`;
    lines.forEach((line) => {
      if (line.className) {
        htmlResult += `<div class="${line.className}">${line.text}</div>
`;
      } 
    });
    htmlResult += `</div></div></div>`;
  }
  if (selectedTheme.value == "phenixTheme") {
    return "not finished lol";
  }
  if (selectedTheme.value == "markorTheme") {
    return "not finished lol";
  }
  return htmlResult;
}

document.getElementById("parseBtn").addEventListener("click", () => {
  const raw = document.getElementById("dialogueInput").value;
  const generated = parseDialogueToHTML(raw);
  document.getElementById("dialogueOutput").value = generated;
});
