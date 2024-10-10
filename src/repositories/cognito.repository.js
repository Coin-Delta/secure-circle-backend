import {
  SignUpCommand,
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ConfirmForgotPasswordCommand,
  ForgotPasswordCommand,
  ChangePasswordCommand,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import awsConfig from "../config/aws.config.js";
import { generateCognitoUserAttributes } from "../utils/helpers.js";
class CognitoRepository {
  constructor() {
    this.cognito = new CognitoIdentityProviderClient({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  create = async (data) => {
    const { email, password, firstName, lastName } = data;
    const command = new SignUpCommand({
      ClientId: awsConfig.clientId,
      Username: email,
      Password: password,
      UserAttributes: generateCognitoUserAttributes({
        given_name: firstName,
        family_name: lastName,
        email,
      }),
    });

    const response = await this.cognito.send(command);

    return response;
  };
  login = async (data) => {
    const { email, password } = data;
    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: awsConfig.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const response = await this.cognito.send(command);

    return response;
  };

  getUserByEmail = async (email = "") => {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: awsConfig.userPoolId,
        Username: email,
      });

      return await this.cognito.send(command);
    } catch (error) {
      if (error.name === "UserNotFoundException") {
        return;
      }
      throw error;
    }
  };

  verifyEmail = async (email, otp) => {
    const command = new ConfirmSignUpCommand({
      ClientId: awsConfig.clientId,
      Username: email,
      ConfirmationCode: otp.toString(),
    });

    return await this.cognito.send(command);
  };
  resendEmailVerification = async (email) => {
    const command = new ResendConfirmationCodeCommand({
      ClientId: awsConfig.clientId,
      Username: email,
    });

    return await this.cognito.send(command);
  };
  forgotPasswordRequest = async (email) => {
    const command = new ForgotPasswordCommand({
      ClientId: awsConfig.clientId,
      Username: email,
    });

    return await this.cognito.send(command);
  };
  forgotPassword = async (data) => {
    const command = new ConfirmForgotPasswordCommand({
      ClientId: awsConfig.clientId,
      Username: data.email,
      ConfirmationCode: data.otp,
      Password: data.password,
    });

    return await this.cognito.send(command);
  };
  changePassword = async (accessToken, data) => {
    const command = new ChangePasswordCommand({
      AccessToken: accessToken,
      PreviousPassword: data.currentPassword,
      ProposedPassword: data.newPassword,
    });

    return await this.cognito.send(command);
  };
  refreshAccessToken = async (token) => {
    const command = new InitiateAuthCommand({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      AuthParameters: {
        REFRESH_TOKEN: token,
      },
      ClientId: awsConfig.clientId,
    });

    return await this.cognito.send(command);
  };

  getUserByAccessToken = async (token) => {
    const command = new GetUserCommand({ AccessToken: token });
    return await this.cognito.send(command);
  };
}

export default CognitoRepository;
