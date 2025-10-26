const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const sendMessage = async (phone, message) => {
  try {
    const response = await fetch(`${API_URL}/api/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error enviando mensaje");
    }

    return data;
  } catch (error) {
    console.error("Error en sendMessage:", error);
    throw error;
  }
};
