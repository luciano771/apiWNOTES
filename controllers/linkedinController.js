import fetch from 'node-fetch';
export default class linkedinController {
// recordar cambiar las url en prod y desarrollo: 
//http://localhost:3000/linkedin/callback desarrollo
//https://tweetv.onrender.com/linkedin/callback produccion

    async codeAToken(code){    
        try {
            // Intercambio de código por token de acceso con LinkedIn
            const accessTokenUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
            const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'https://tweetv.onrender.com/linkedin/callback',
            client_id: '7769lq0gs6nd95',
            client_secret: 'bvcDXeKGO1P8L4vV'
            });

            const tokenResponse = await fetch(accessTokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
            });

            const tokenData = await tokenResponse.json();
            return tokenData;
            } 
        catch(error) {
            console.error('Error al intercambiar el código por token de acceso:', error);
            return error
        }

    }

    async userProfile(access_token){
        try {
            // Intercambio de código por token de acceso con LinkedIn
            const urlProfile = 'https://api.linkedin.com/v2/userinfo';
           
            const idShare = await fetch(urlProfile, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${access_token}`,
            },
        });

            const userProfile = await idShare.json();
            return userProfile;
        } 
        catch(error) {
            console.error('Error al intercambiar el código por token de acceso:', error);
            return error
        }
    }


    async share(access_token, contentShare, sub) {
        try {
            const urlShare = 'https://api.linkedin.com/v2/ugcPosts';
    
            const idShare = await fetch(urlShare, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Corrección aquí
                    'Authorization': `Bearer ${access_token}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                },
                body: JSON.stringify({
                    "author": `urn:li:person:${sub}`, // Usando template literals para concatenar sub
                    "lifecycleState": "PUBLISHED",
                    "specificContent": {
                        "com.linkedin.ugc.ShareContent": {
                            "shareCommentary": {
                                "text": contentShare,
                            },
                            "shareMediaCategory": "NONE"
                        }
                    },
                    "visibility": {
                        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
                    }
                })
            });
    
            const id = await idShare.json();
            console.log(id);
            return id;
        } catch(error) {
            console.error('Error al realizar la publicación:', error);
            return error;
        }
    }
    



     
}
