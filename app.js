// Substitua YOUR_API_KEY pela sua chave de API do Google
const API_KEY = 'a4ac0722b86b4efac11af8a7b519d461eeb5ef22';
const SPREADSHEET_ID = '1HSwR1dCqCxGl_exE7BK3DY1cFMCsCfwnmsedIfry9cw';
const YOUTUBE_VIDEO_ID = '-6dSUf8wAHM';

// Carregar APIs do Google
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4')
    .then(() => {
      console.log('GAPI client loaded for API');
    }, (error) => {
      console.error('Error loading GAPI client for API', error);
    });
}

gapi.load('client', loadClient);

// Inicializar o player do YouTube
function onYouTubeIframeAPIReady() {
  new YT.Player('player', {
    height: '360',
    width: '640',
    videoId: YOUTUBE_VIDEO_ID,
  });
}

// Carregar o script do YouTube
(function() {
  var tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

// Gerar linhas da tabela
const tbody = document.querySelector('tbody');
for (let i = 1; i <= 24; i++) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>Modelo ${i}</td>
    <td><input type="number" min="0" name="modelo${i}-cor1" id="modelo${i}-cor1"></td>
    <td><input type="number" min="0" name="modelo${i}-cor2" id="modelo${i}-cor2"></td>
    <td><input type="number" min="0" name="modelo${i}-cor3" id="modelo${i}-cor3"></td>
    <td><input type="number" min="0" name="modelo${i}-cor4" id="modelo${i}-cor4"></td>
  `;
  tbody.appendChild(tr);
}

// Enviar dados para o Google Sheets
document.getElementById('product-selection-form').addEventListener('submit', (event) => {
  event.preventDefault();
  
  const storeName = document.getElementById('store-name').value;
  const values = [[storeName]];

  for (let i = 1; i <= 24; i++) {
    const row = [`Modelo ${i}`];
    for (let j = 1; j <= 4; j++) {
      const input = document.getElementById(`modelo${i}-cor${j}`);
      row.push(input.value || '0');
    }
    values.push(row);
  }

  const sheetsAPI = gapi.client.sheets.spreadsheets.values;
  sheetsAPI.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sheet1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: values
    }
  }).then((response) => {
    console.log('Resposta da API do Google Sheets:', response.result);
    alert('Resposta enviada com sucesso!');
  }, (error) => {
    console.error('Erro ao enviar dados para o Google Sheets:', error.result.error);
    alert('Erro ao enviar a resposta. Por favor, tente novamente.');
  });
});
