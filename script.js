const API_URL = "https://api-logs.devalltech.com.br/api/v1/events";
const PROJECT_TOKEN = "0b03293de05d2c630c9428bfe13e08393a10db73f10717226b0b3247dbf4913e";

function nowUtcIso() {
  return new Date().toISOString();
}

function getClientDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screen: {
      width: window.screen.width,
      height: window.screen.height
    }
  };
}

async function sendEvent({ projectToken, type = "event", environment = "production", category = "general", message = "", payload = {}, deviceId = null, timestamp = null, ip = null }) {
  const body = {
    deviceId: deviceId || "browser-" + Math.random().toString(36).substr(2, 9),
    timestamp: timestamp || nowUtcIso(),
    type,
    environment,
    category,
    message,
    payload,
    deviceInfo: getClientDeviceInfo(),
    ip
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-project-token": projectToken
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      console.debug("DevAllAnalytics error:", res.status, await res.text());
    }
  } catch (e) {
    console.debug("DevAllAnalytics failed:", e);
  }
}

// Botões
document.getElementById("btn-whatsapp").addEventListener("click", () => {
  sendEvent({ projectToken: PROJECT_TOKEN, category: "button", message: "Usuário clicou no WhatsApp" });
  window.open("https://wa.me/5547991386890", "_blank");
});

document.getElementById("btn-site").addEventListener("click", () => {
  sendEvent({ projectToken: PROJECT_TOKEN, category: "button", message: "Usuário clicou no Site" });
  window.open("https://ateliesagradadevocao.com.br/", "_blank");
});

document.getElementById("btn-prevenda").addEventListener("click", () => {
  sendEvent({ projectToken: PROJECT_TOKEN, category: "button", message: "Usuário clicou na Pré-venda" });
  window.open("https://crucifixo.ateliesagradadevocao.com.br/", "_blank");
});

// Evento de visualização da página
sendEvent({
  projectToken: PROJECT_TOKEN,
  category: "pageview",
  message: "Landing page carregada"
});


//Pixel do Meta Facebook
document.getElementById("btn-whatsapp").addEventListener("click", () => {
  fbq('track', 'Contact', { method: 'WhatsApp' });
});

document.getElementById("btn-site").addEventListener("click", () => {
  fbq('track', 'ViewContent', { content_name: 'Site' });
});

document.getElementById("btn-prevenda").addEventListener("click", () => {
  fbq('track', 'ViewContent', { item: 'Crucifixo Realista' });
});

