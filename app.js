const CLIENT_ID =
  "542180890854-cplqpn895bjrb999tl72glk693al392h.apps.googleusercontent.com";
const API_KEY = "AIzaSyCuvnTSzvSgTffU9sQ6TRRhD225auxm-54";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const SPREADSHEET_ID = "1HSwR1dCqCxGl_exE7BK3DY1cFMCsCfwnmsedIfry9cw";
const YOUTUBE_VIDEO_ID = "-6dSUf8wAHM";

function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client
    .load("https://sheets.googleapis.com/$discovery/rest?version=v4")
    .then(
      () => {
        console.log("GAPI client loaded for API");
        gapi.auth2
          .init({
            client_id: CLIENT_ID,
            scope: SCOPES,
          })
          .then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            const authorizeButton = document.getElementById("authorize_button");
            const signoutButton = document.getElementById("signout_button");
            authInstance.isSignedIn.listen(updateSigninStatus);
            updateSigninStatus(authInstance.isSignedIn.get());
            authorizeButton.onclick = authInstance.signIn;
            signoutButton.onclick = authInstance.signOut;
          });
      },
      (error) => {
        console.error("Error loading GAPI client for API:", error);
      }
    );
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

gapi.load("client", loadClient);

function onYouTubeIframeAPIReady() {
  new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: YOUTUBE_VIDEO_ID,
  });
}

(function () {
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
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
