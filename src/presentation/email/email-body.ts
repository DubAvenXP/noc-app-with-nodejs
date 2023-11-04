export const emailBodyTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: 'Arial', sans-serif;
    color: #333;
    background-color: #f4f4f4;
    padding: 20px;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  .header {
    font-size: 24px;
    color: #333;
    text-align: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }
  .content {
    line-height: 1.6;
    color: #555;
    margin-top: 20px;
  }
  .footer {
    font-size: 12px;
    text-align: center;
    color: #999;
    border-top: 1px solid #ddd;
    padding-top: 10px;
    margin-top: 20px;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      Logs from ${new Date().toLocaleString()}
    </div>
    <div class="content">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus, laborum.</p>
      <p>Este es un ejemplo de log generado en el sistema. Por favor, asegúrese de revisarlo y tomar las acciones pertinentes.</p>
    </div>
    <div class="footer">
      Este es un mensaje automatizado, por favor no responda directamente a este correo.
    </div>
  </div>
</body>
</html>
`;
