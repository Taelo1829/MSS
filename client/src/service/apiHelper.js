export function getAPI() {
  try {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    } else {
      return "https://mss-04fx.onrender.com";
    }
  } catch (error) {
    handleError(error);
  }
}

export function handleError(error) {
  console.error(error);
  alert(error.message);
}
