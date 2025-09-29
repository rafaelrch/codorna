# 📊 Integração com Google Sheets - Fila de Espera

## 🎯 **Objetivo**
Enviar dados do formulário de fila de espera diretamente para uma planilha do Google Sheets.

## 📋 **Passo a Passo**

### **1. Configurar Google Apps Script**

1. **Acesse:** [script.google.com](https://script.google.com)
2. **Clique em:** "Novo projeto"
3. **Cole este código** no editor:

```javascript
function doPost(e) {
  try {
    // Obter dados do POST
    const data = JSON.parse(e.postData.contents);
    const { nome, email, telefone } = data;
    
    // ID da sua planilha (substitua pelo seu)
    const SHEET_ID = 'SEU_SHEET_ID_AQUI';
    
    // Abrir planilha
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    
    // Adicionar dados na próxima linha disponível
    const timestamp = new Date();
    sheet.appendRow([nome, email, telefone, timestamp]);
    
    // Retornar sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Google Apps Script funcionando!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### **2. Obter ID da Planilha**

1. **Abra sua planilha** "Codorna | Fila de espera"
2. **Copie o ID** da URL:
   ```
   https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
   ```
3. **Substitua** `SEU_SHEET_ID_AQUI` no código pelo ID real

### **3. Deploy do Script**

1. **Clique em:** "Deploy" → "Nova implantação"
2. **Tipo:** "Aplicativo da Web"
3. **Executar como:** "Eu mesmo"
4. **Quem tem acesso:** "Qualquer pessoa"
5. **Clique em:** "Implantar"
6. **COPIE a URL** gerada (será usada no frontend)

### **4. Configurar Planilha**

1. **Certifique-se** que as colunas estão na ordem:
   - A: Nome
   - B: Email  
   - C: Telefone
   - D: Data/Hora (será preenchida automaticamente)

### **5. Testar**

1. **Use esta URL** para testar:
   ```
   https://script.google.com/macros/s/SUA_URL_AQUI/exec
   ```
2. **Método:** POST
3. **Body:** 
   ```json
   {
     "nome": "João Silva",
     "email": "joao@teste.com", 
     "telefone": "5511999999999"
   }
   ```

---

## 🔧 **Próximos Passos**

Após configurar o Google Apps Script, o frontend será atualizado para enviar os dados automaticamente.

**URL do Script será adicionada ao código do WaitlistPopup.**
