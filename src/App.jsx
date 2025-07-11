import React, { useState } from "react";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#e0f2fe",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    width: "100%",
    maxWidth: 600,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#2c3e50",
  },
  label: {
    display: "block",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: "#34495e",
  },
  input: {
    width: "100%",
    padding: 16,
    fontSize: 18,
    borderRadius: 12,
    border: "2px solid #d1d5db",
    marginBottom: 24,
    boxSizing: "border-box",
  },
  fileInput: {
    marginBottom: 24,
  },
  screensContainer: {
    marginBottom: 24,
  },
  screenBlock: {
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    backgroundColor: "#f9fafb",
  },
  screenInput: {
    width: "100%",
    padding: 12,
    fontSize: 18,
    borderRadius: 12,
    border: "2px solid #d1d5db",
    marginBottom: 12,
    boxSizing: "border-box",
  },
  removeButton: {
    fontSize: 28,
    color: "#e53e3e",
    background: "none",
    border: "none",
    cursor: "pointer",
    marginTop: 8,
  },
  addScreenButton: {
    padding: "16px 32px",
    fontSize: 20,
    borderRadius: 12,
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: "100%",
    marginBottom: 24,
  },
  submitButton: {
    padding: "18px 0",
    fontSize: 22,
    borderRadius: 12,
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  },
  successMessage: {
    textAlign: "center",
    color: "#059669",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
  },
  errorMessage: {
    textAlign: "center",
    color: "#dc2626",
    fontSize: 18,
    marginBottom: 24,
    whiteSpace: "pre-wrap",
  },
  loading: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 24,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 18,
    userSelect: "none",
  },
};

const CLIENTS = {
  "OK Foods": {
    boardId: 8580538177,
    fileColumnId: "files",
  },
  Usave: {
    boardId: 4918008751,
    fileColumnId: "files3",
  },
  BP: {
    boardId: 2040145285,
    fileColumnId: "files__1",
  },
  Goldwagen: {
    boardId: 8580549417,
    fileColumnId: "files__1",
  },
  "Sportsmans Warehouse": {
    boardId: 2040227054,
    fileColumnId: "file_mks9j2ag",
  },
  Petworld: {
    boardId: 2035898218,
    fileColumnId: "file_mksqt1xb",
  },
  Britos: {
    boardId: 2040213584,
    fileColumnId: "file_mkp4c3bp",
  },
  "V&A Waterfront": {
    boardId: 8589977804,
    fileColumnId: "files",
  },
  PNA: {
    boardId: 4858437792,
    fileColumnId: "files",
  },
  "PnP Clothing": {
    boardId: 8165706664,
    fileColumnId: "file_mknqx8v5",
  },
};

export default function App() {
  const [formData, setFormData] = useState({
    client: "",
    storeName: "",
    screens: [],
    subitemsWanted: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = "https://monday-file-backend.onrender.com";

  async function uploadFileToBackend(file, client, itemId) {
    const clientInfo = CLIENTS[client];
    if (!clientInfo) throw new Error("Invalid client");

    const fileColumnId = clientInfo.fileColumnId;

    const formData = new FormData();
    formData.append("file", file);

    const url = new URL(`${BACKEND_URL}/upload`);
    url.searchParams.append("item_id", itemId);
    url.searchParams.append("column_id", fileColumnId);

    const response = await fetch(url.toString(), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      throw new Error(errRes.error || "File upload failed on backend");
    }

    const result = await response.json();

    if (!result.data || !result.data.add_file_to_column) {
      throw new Error(result.error || "File upload failed on backend");
    }

    return result.data.add_file_to_column.id;
  }

  async function createMainItem(boardId, itemName) {
    const response = await fetch(`${BACKEND_URL}/create-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ boardId, itemName }),
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      throw new Error(errRes.error || "Create main item failed");
    }

    const result = await response.json();

    if (!result.data || !result.data.create_item) {
      throw new Error(result.error || "Create main item failed");
    }

    return result.data.create_item.id;
  }

  async function createSubitem(parentItemId, itemName) {
    const response = await fetch(`${BACKEND_URL}/create-subitem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentItemId, itemName }),
    });

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({}));
      throw new Error(errRes.error || "Create subitem failed");
    }

    const result = await response.json();

    if (!result.data || !result.data.create_subitem) {
      throw new Error(result.error || "Create subitem failed");
    }

    return result.data.create_subitem.id;
  }

  const addScreen = () => {
    setFormData((prev) => ({
      ...prev,
      screens: [...prev.screens, { name: "", serialPic: null, boxPic: null }],
    }));
  };

  const updateScreen = (index, field, value) => {
    setFormData((prev) => {
      const newScreens = [...prev.screens];
      newScreens[index] = { ...newScreens[index], [field]: value };
      return { ...prev, screens: newScreens };
    });
  };

  const removeScreen = (index) => {
    setFormData((prev) => {
      const newScreens = [...prev.screens];
      newScreens.splice(index, 1);
      return { ...prev, screens: newScreens };
    });
  };

  const submitToBackend = async (data) => {
    setLoading(true);
    setError(null);

    try {
      if (!data.client || !(data.client in CLIENTS))
        throw new Error("Invalid client selected.");

      const clientInfo = CLIENTS[data.client];
      const boardId = clientInfo.boardId;

      const mainItemId = await createMainItem(boardId, data.storeName);

      if (!data.subitemsWanted && data.screens.length > 0) {
        // Upload serialPic and boxPic both if they exist for the first screen
        if (data.screens[0].serialPic) {
          await uploadFileToBackend(data.screens[0].serialPic, data.client, mainItemId);
        }
        if (data.screens[0].boxPic) {
          await uploadFileToBackend(data.screens[0].boxPic, data.client, mainItemId);
        }
      }

      if (data.subitemsWanted) {
        for (const screen of data.screens) {
          const subitemId = await createSubitem(mainItemId, screen.name || "Unnamed Screen");

          if (screen.serialPic) {
            await uploadFileToBackend(screen.serialPic, data.client, subitemId);
          }
          if (screen.boxPic) {
            await uploadFileToBackend(screen.boxPic, data.client, subitemId);
          }
        }
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);

      let message = "Failed to submit to backend";

      if (typeof err === "string") {
        message = err;
      } else if (err && typeof err.message === "string") {
        message = err.message;
      } else if (err) {
        try {
          message = JSON.stringify(err, null, 2);
        } catch {}

      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitToBackend(formData);
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <div style={styles.successMessage}>✅ Installation submitted successfully!</div>
          <button
            style={styles.submitButton}
            onClick={() => {
              setSubmitted(false);
              setFormData({
                client: "",
                storeName: "",
                screens: [],
                subitemsWanted: false,
              });
            }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.heading}>Install Submission</h1>

        {error && (
          <div style={styles.errorMessage}>
            {typeof error === "string" ? error : JSON.stringify(error, null, 2)}
          </div>
        )}
        {loading && <div style={styles.loading}>Submitting...</div>}

        <label htmlFor="client" style={styles.label}>
          Client
        </label>
        <select
          id="client"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
          style={styles.input}
          required
        >
          <option value="">Select Client</option>
          {Object.keys(CLIENTS).map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>

        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            id="subitemsWanted"
            checked={formData.subitemsWanted}
            onChange={(e) => setFormData({ ...formData, subitemsWanted: e.target.checked })}
          />
          <label htmlFor="subitemsWanted" style={styles.checkboxLabel}>
            Subitems wanted
          </label>
        </div>

        <label htmlFor="storeName" style={styles.label}>
          Store Name
        </label>
        <input
          id="storeName"
          type="text"
          value={formData.storeName}
          onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
          placeholder="Pretoria Store"
          style={styles.input}
          required
        />

        {!formData.subitemsWanted && (
          <>
            <label style={styles.label}>Serial Number Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  screens: [
                    {
                      name: formData.storeName,
                      serialPic: e.target.files[0],
                      boxPic: formData.screens.length > 0 ? formData.screens[0].boxPic : null,
                    },
                  ],
                })
              }
              style={styles.fileInput}
              required
            />

            <label style={styles.label}>Box Photo Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  screens: [
                    {
                      name: formData.storeName,
                      serialPic: formData.screens.length > 0 ? formData.screens[0].serialPic : null,
                      boxPic: e.target.files[0],
                    },
                  ],
                })
              }
              style={styles.fileInput}
              required
            />
          </>
        )}

        {formData.subitemsWanted && (
          <>
            <label style={styles.label}>Screens</label>
            <div style={styles.screensContainer}>
              {formData.screens.map((screen, idx) => (
                <div key={idx} style={styles.screenBlock}>
                  <input
                    type="text"
                    value={screen.name}
                    onChange={(e) => updateScreen(idx, "name", e.target.value)}
                    placeholder={`Screen ${idx + 1} name`}
                    style={styles.screenInput}
                    required
                  />
                  <label style={styles.label}>Serial Number Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateScreen(idx, "serialPic", e.target.files[0])}
                    style={styles.fileInput}
                    required
                  />
                  <label style={styles.label}>Box Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => updateScreen(idx, "boxPic", e.target.files[0])}
                    style={styles.fileInput}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeScreen(idx)}
                    aria-label={`Remove screen ${idx + 1}`}
                    style={styles.removeButton}
                  >
                    &times; Remove Screen
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addScreen} style={styles.addScreenButton}>
              + Add Screen
            </button>
          </>
        )}

        <button type="submit" style={styles.submitButton} disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
