import express from "express";
import linkedinController from "../controllers/linkedinController.js";

const linkedinRoutes = express.Router();
const linkedincontroller = new linkedinController();

// link de desarrollo
//const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=7769lq0gs6nd95&redirect_uri=http://localhost:3000/linkedin/callback&state=random_state&scope=openid%20profile%20w_member_social`;

// link de produccion  recordar que la url debe estar en la misma linea sin saltos.
const linkedinAuthUrl = "";

// Ruta para iniciar la autenticación con LinkedIn
linkedinRoutes.get("/", (req, res) => {
  res.redirect(linkedinAuthUrl);
});

linkedinRoutes.get("/callback", async (req, res) => {
  try {
    const code = req.query["code"];
    if (!code) {
      res.status(400).send("Código de autorización faltante");
      return;
    }
    const access_token = await linkedincontroller.codeAToken(code);
    console.log(access_token.access_token);

    res.cookie("accesstokenlinkedin", access_token.access_token, {
      maxAge: access_token.expires_in,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    console.log(access_token);
    res.redirect("https://tweetv.onrender.com/linkedin/user"); // pagina principal
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en la autenticación con LinkedIn");
  }
});

linkedinRoutes.post("/share", async (req, res) => {
  try {
    const mensaje = req.body.mensaje;
    const cookie = req.cookies;
    console.log(cookie.sub, cookie.accesstokenlinkedin, mensaje);
    const idShare = await linkedincontroller.share(
      cookie.accesstokenlinkedin,
      mensaje,
      cookie.sub
    );
    console.log(idShare);
    res.send(idShare);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en la autenticación con LinkedIn");
  }
});

linkedinRoutes.get("/user", async (req, res) => {
  try {
    const accessToken = req.cookies;

    let user = await linkedincontroller.userProfile(
      accessToken.accesstokenlinkedin
    );

    res.cookie("name", user.name, {
      maxAge: accessToken.expires_in,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.cookie("name", user.name, {
      maxAge: accessToken.expires_in,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.cookie("picture", user.picture, {
      maxAge: accessToken.expires_in,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });
    res.cookie("sub", user.sub, {
      maxAge: accessToken.expires_in,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    });

    console.log(user);
    res.redirect("https://tweetv.onrender.com"); // pagina principal
  } catch (error) {
    console.error(error);
    res.status(500).send("Error en la autenticación con LinkedIn");
  }
});

linkedinRoutes.get("/cookie", async (req, res) => {
  console.log(req.cookies);
  res.send(req.cookies);
});

export default linkedinRoutes;
