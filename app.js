const clientId = "542180890854-cplqpn895bjrb999tl72glk693al392h.apps.googleusercontent.com";
const apiKey = "a4ac0722b86b4efac11af8a7b519d461eeb5ef22";
const scopes = "https://www.googleapis.com/auth/spreadsheets";
const SPREADSHEET_ID = "1HSwR1dCqCxGl_exE7BK3DY1cFMCsCfwnmsedIfry9cw";
const YOUTUBE_VIDEO_ID = "-6dSUf8wAHM";

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  gapi.client
    .init({
      apiKey: apiKey,
      clientId: clientId,
      scope: scopes,
    })
    .then(function () {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

      loadClient();
    });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById("authorize_button").style.display = "none";
    document.getElementById("signout_button").style.display = "block";
  } else {
    document.getElementById("authorize_button").style.display = "block";
    document.getElementById("signout_button").style.display = "none";
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

handleClientLoad();

function loadClient() {
  gapi.client.setApiKey(apiKey);
  return gapi.client
    .load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(() => {
      console.log("GAPI client loaded for API");

      document
        .getElementById("product-selection-form")
        .addEventListener("submit", (event) => {
          event.preventDefault();
          const storeName = document.getElementById("store-name").value;
          const values = [[storeName]];

          for (let i = 1; i <= 24; i++) {
            const row = [`Modelo ${i}`];
            for (let j = 1; j <= 4; j++) {
              const input = document.getElementById(`modelo${i}-cor${j}`);
              row.push(input.value || "0");
            }
            values.push(row);
          }

          const sheetsAPI = gapi.client.sheets.spreadsheets.values;
          sheetsAPI
            .append({
              spreadsheetId: SPREADSHEET_ID,
              range: "Página1",
              valueInputOption: "RAW",
              insertDataOption: "INSERT_ROWS",
              resource: {
                values: values,
              },
            })
            .then(
              (response) => {
                console.log("Resposta da API do Google Sheets:", response.result);
                alert("Resposta enviada com sucesso!");
              },
              (error) => {
                console.error(
                  "Erro ao enviar dados para o Google Sheets:",
                  error.result.error
                );
                alert("Erro ao enviar a resposta. Por favor, tente novamente.");
              }
            );
        });
    });
}

gapi.load("client", loadClient);

function onYouTubeIframeAPIReady() {
  new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: YOUTUBE_VIDEO_ID,
  });
}

(function () {
  var tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

const tbody = document.querySelector("tbody");
for (let i = 1; i <= 24; i++) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>Modelo ${i}</td>
    <td><input type="number" min="0" name="modelo${i}-cor1" id="modelo${i}-cor1"></td>
    <td><input type="number" min="0" name="modelo${i}-cor2" id="modelo${i}-cor2"></td>
    <td><input type="number" min="0" name="modelo${i}-cor3" id="modelo${i}-cor3"></td>
    <td><input type="number" min="0" name="modelo${i}-cor4" id="modelo${i}-cor4"></td>
`;
  tbody.appendChild(tr);
}

document
  .getElementById("product-selection-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const storeName = document.getElementById("store-name").value;
    const values = [[storeName]];

    for (let i = 1; i <= 24; i++) {
      const row = [`Modelo ${i}`];
      for (let j = 1; j <= 4; j++) {
        const input = document.getElementById(`modelo${i}-cor${j}`);
        row.push(input.value || "0");
      }
      values.push(row);
    }

    const sheetsAPI = gapi.client.sheets.spreadsheets.values;
    sheetsAPI
      .append({
        spreadsheetId: SPREADSHEET_ID,
        range: "Página1",
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: values,
        },
      })
      .then(
        (response) => {
          console.log("Resposta da API do Google Sheets:", response.result);
          alert("Resposta enviada com sucesso!");
        },
        (error) => {
          console.error(
            "Erro ao enviar dados para o Google Sheets:",
            error.result.error
          );
          alert("Erro ao enviar a resposta. Por favor, tente novamente.");
        }
      );
  });
