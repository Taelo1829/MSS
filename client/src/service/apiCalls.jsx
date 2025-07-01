import { getAPI, handleError } from "./apiHelper";

const useFetch = () => {
  const connect = (payLoad) => {
    try {
      const api = getAPI();
      const response = fetch(api + "/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });

      return response;
    } catch (error) {
      handleError(error);
    }
  };

  return { connect };
};

export default useFetch;
