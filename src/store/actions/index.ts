import { loginAction, clearLoginAction } from "../slices/auth-login";
import { userLoginAction, clearUserLoginAction } from "../slices/user-auth-login";
import { userRegisterAction, clearUserRegisterAction } from "../slices/user-auth-register";
import { registerAction, clearRegisterAction } from "../slices/auth-register";
import { setupAction, clearSetupAction } from "../slices/auth-setup";
import { verifySetupAction, clearVerifySetupAction } from "../slices/auth-verify-setup";
import { resetAction, clearResetAction } from "../slices/auth-reset";
import { getAllUsersAction, clearGetAllUsersAction } from "../slices/get-all-users";

import { getAllPropertiesAction, clearGetAllPropertiesAction } from "../slices/get-all-properties";
import { getPropertyByIdAction, cleargetPropertyByIdAction } from "../slices/get-property-by-id";
import { createPropertyAction, clearCreatePropertyAction } from "../slices/create-property";
import { updatePropertyAction, clearupdatePropertyAction } from "../slices/edit-property";
import { deletePropertyAction, clearDeletePropertyAction } from "../slices/delete-property";
import { getAboutAction, cleargetAboutAction } from "../slices/get-about";
import { createAboutAction, clearCreateAboutAction } from "../slices/create-about";
import { updateAboutAction, clearUpdateAboutAction } from "../slices/update-about";
import { deleteAboutAction, clearDeleteAboutAction } from "../slices/delete-about";
import { uploadImagesAction, clearUploadImagesAction } from "../slices/upload-images";

export {
  loginAction, clearLoginAction,
  registerAction, clearRegisterAction,
  setupAction, clearSetupAction,
  verifySetupAction, clearVerifySetupAction,
  resetAction, clearResetAction,
  getAllUsersAction, clearGetAllUsersAction,
  getAllPropertiesAction, clearGetAllPropertiesAction,
  getPropertyByIdAction, cleargetPropertyByIdAction,
  createPropertyAction, clearCreatePropertyAction,
  updatePropertyAction, clearupdatePropertyAction,
  deletePropertyAction, clearDeletePropertyAction,
  getAboutAction, cleargetAboutAction,
  createAboutAction, clearCreateAboutAction,
  updateAboutAction, clearUpdateAboutAction,
  deleteAboutAction, clearDeleteAboutAction,
  uploadImagesAction, clearUploadImagesAction,
  userLoginAction, clearUserLoginAction,
  userRegisterAction, clearUserRegisterAction,
};
