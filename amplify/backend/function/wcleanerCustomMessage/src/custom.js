/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger
  if (event.triggerSource === "CustomMessage_AdminCreateUser") {
    event.response.emailSubject = "Welcome to the WCleaner app";
    const email = event.request.usernameParameter;
    const password = event.request.codeParameter;
    event.response.emailMessage = createUserTemplate(email, password);
  }
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const email = event.request.userAttributes.email;
    const code = event.request.codeParameter;
    const redirectTo = event.request.clientMetadata.redirectTo;
    event.response.emailSubject = "Reset your password";
    event.response.emailMessage = forgotPasswordTemplate(
      email,
      code,
      redirectTo
    );
  }
  return event;
};

const createUserTemplate = (email, password) => `
<html style="margin: 0;padding: 0;font-family: &quot;Lucida Sans&quot;, &quot;Lucida Sans Regular&quot;, &quot;Lucida Grande&quot;,
         &quot;Lucida Sans Unicode&quot;, Geneva, Verdana, sans-serif;text-align: center;background-color: rgb(196, 240, 225);">
 <head>
   
 </head>
 <h1 class="header" style="margin-top: 10px;width: 70%;text-align: center;background-color: #f9be52;border-radius: 5px;padding: 20px;margin: auto;">Welcome to WCleaner</h1>
 <div class="body" style="padding: 10px;">
    <div align="center" class="alignment" style="line-height: 10px;align-items: &quot;center&quot;;">
        <img alt="Company Logo" src="https://i.imgur.com/GqR4ALC.jpg" title="Company Logo" width="147" style="display: block;height: auto;border: 0;width: 147px;max-width: 100%;margin-bottom: 20px;">
    </div>
    <div align="center" class="alignment" style="line-height: 10px;align-items: &quot;center&quot;;">
        <img alt="Reset Password" src="https://i.imgur.com/M4uqdif.png" width="147" style="display: block;height: auto;border: 0;width: 147px;max-width: 100%;margin-bottom: 20px;">
    </div>

   <h2 align="center" class="alignment" style="font-size: 1rem;font-weight: normal;width: 100%;">Your temporary credentials are:</h2>

   <div align="center" class="alignment" class="credentials" style="width: 400px;border-collapse: collapse;margin: 0 auto;margin-top: 10px;">
        <div>
            <h2>Email:</h2>
            <p class="email">${email}</p>
        </div>
        <div>
            <h2>Password:</h2>
            <p class="password">${password}</p>
        </div>
    </div>
 </div>
</html>
`;

const forgotPasswordTemplate = (email, code, redirectTo) => `
<html style="margin: 0;padding: 0;font-family: &quot;Lucida Sans&quot;, &quot;Lucida Sans Regular&quot;, &quot;Lucida Grande&quot;,
         &quot;Lucida Sans Unicode&quot;, Geneva, Verdana, sans-serif;text-align: center;background-color: rgb(196, 240, 225);">
 <head>
   
 </head>
 <h1 class="header" style="margin-top: 10px;width: 70%;text-align: center;background-color: #f9be52;border-radius: 5px;padding: 20px;margin: auto;">WCleaner</h1>
 <div class="body" style="padding: 10px;">
    <div align="center" class="alignment" style="line-height: 10px;align-items: &quot;center&quot;;">
        <img alt="Reset Password" src="https://i.imgur.com/UJ2dVz2.gif" width="300" style="display: block;height: auto;border: 0;width: 147px;max-width: 100%;margin-bottom: 20px;">
    </div>

   <h2 align="center" class="alignment" style="font-size: 1rem;font-weight: normal;width: 100%;">Reset your password following the link:</h2>

   <div align="center" class="alignment" class="credentials" style="width: 400px;border-collapse: collapse;margin: 0 auto;margin-top: 10px;">
        <a href="${redirectTo}/reset-password?email=${email}&code=${code}" target="_blank">Click here</a>
    </div>
 </div>
</html>`;
