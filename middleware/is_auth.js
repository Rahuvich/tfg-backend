import jwt from "jsonwebtoken";
import util from "util";

const webSocketAuth = (connectionParams, webSocket) => {
  if (!connectionParams["Authorization"]) {
    return {
      isAuth: false,
    };
  }
  const token = connectionParams["Authorization"].split(" ")[1];

  if (!token || token === "") {
    return {
      isAuth: false,
    };
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "someSuperSecretKey");
  } catch (err) {
    return {
      isAuth: false,
    };
  }

  if (!decodedToken) {
    return {
      isAuth: false,
    };
  }

  return {
    isAuth: true,
    userId: decodedToken.userId,
  };
};
const httpAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, "someSuperSecretKey");
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  return next();
};

export const WebSocketAuth = webSocketAuth;
export const HttpAuth = httpAuth;
