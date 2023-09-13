export const AppConfig = {
  apiUrl: "http://localhost:6868/api",
  routerBase: "",
};

export const ImageConfig = {
  apiUrl: "http://localhost:80/article/",
  routerBase: "",
};

export function getImageUrl(id) {
  return `${ImageConfig.apiUrl}${id}.png`;
}
export const idUser = "82cf9e1e-904e-4e40-8748-b5705d332f07";
