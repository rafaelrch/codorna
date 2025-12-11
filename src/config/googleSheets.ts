// Configuração do Google Sheets para fila de espera
export const GOOGLE_SHEETS_CONFIG = {
  // URL do seu Google Apps Script
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwD2S_HX9adzrgToeGGqrwY_9XotpuDGNZcbQaf7iJ8IZObtUmrMPYJxFnTgLr8MSDz/exec'
}

// Função para enviar dados para Google Sheets
export const sendToGoogleSheets = async (data: { nome: string; email: string; telefone: string }) => {
  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Necessário para Google Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    
    return { success: true, response }
  } catch (error) {
    return { success: false, error }
  }
}
