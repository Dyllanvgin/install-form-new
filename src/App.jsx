import React, { useState } from "react";

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#e0f2fe", // lighter blue shade background
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
  screenInputRow: {
    marginBottom: 16,
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
};

export default function App() {
  const [formData, setFormData] = useState({
    client: "",
    location: "",
    storeName: "",
    screens: [], // each screen is { name, serialPic, boxPic }
  });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = () => {
    // For testing: show collected data in console
    console.log(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.form}>
          <div style={styles.successMessage}>🔥 Your install submission has been received! 🔥</div>
          <button
            style={styles.submitButton}
            onClick={() => {
              setSubmitted(false);
              setFormData({
                client: "",
                location: "",
                storeName: "",
                screens: [],
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
      <form
        style={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <h1 style={styles.heading}>Install Submission</h1>

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
          <option value="OK Client">OK Client</option>
          <option value="USave Client">USave Client</option>
          <option value="Goldwagen Client">Goldwagen Client</option>
          <option value="PnP Client">PnP Client</option>
        </select>

        <label htmlFor="location" style={styles.label}>
          Location
        </label>
        <input
          id="location"
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="East Wing"
          style={styles.input}
          required
        />

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

        <button type="submit" style={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
}
