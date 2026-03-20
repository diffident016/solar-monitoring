function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export async function initTokenClient(clientId) {
  await loadScript("https://accounts.google.com/gsi/client");
  return new Promise((resolve, reject) => {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "https://www.googleapis.com/auth/drive.readonly",
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.access_token);
        }
      },
    });
    tokenClient.requestAccessToken();
  });
}

export async function openPicker({ apiKey, token, onPicked }) {
  await loadScript("https://apis.google.com/js/api.js");
  await new Promise((resolve) => window.gapi.load("picker", resolve));

  const view = new window.google.picker.DocsView()
    .setMimeTypes("text/csv")
    .setMode(window.google.picker.DocsViewMode.LIST);

  const picker = new window.google.picker.PickerBuilder()
    .addView(view)
    .setOAuthToken(token)
    .setDeveloperKey(apiKey)
    .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
    .setCallback((data) => {
      if (data.action === window.google.picker.Action.PICKED) {
        onPicked(data.docs);
      }
    })
    .build();

  picker.setVisible(true);
}

export async function downloadFile(fileId, token) {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`Failed to download file: ${res.status}`);
  return res.text();
}
