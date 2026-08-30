import { combineReducers } from "redux";

import loginReducer from "../slices/auth-login";
import registerReducer from "../slices/auth-register";
import setupReducer from "../slices/auth-setup";
import verifySetupReducer from "../slices/auth-verify-setup";
import resetReducer from "../slices/auth-reset";
import getAllUsersReducer from "../slices/get-all-users";

import getAllPropertiesReducer from "../slices/get-all-properties";
import getPropertyByIdReducer from "../slices/get-property-by-id";
import createPropertyReducer from "../slices/create-property";
import updatePropertyReducer from "../slices/edit-property";
import deletePropertyReducer from "../slices/delete-property";

import getAboutReducer from "../slices/get-about";
import createAboutReducer from "../slices/create-about";
import updateAboutReducer from "../slices/update-about";
import deleteAboutReducer from "../slices/delete-about";

import uploadImagesReducer from "../slices/upload-images";
import userLoginReducer from "../slices/user-auth-login";
import userRegisterReducer from "../slices/user-auth-register";

const rootReducer = combineReducers({
  loginReducer, registerReducer, setupReducer, verifySetupReducer, resetReducer, getAllUsersReducer,
  getAllPropertiesReducer,
  getPropertyByIdReducer,
  createPropertyReducer,
  updatePropertyReducer,
  deletePropertyReducer,
  getAboutReducer,
  createAboutReducer,
  updateAboutReducer,
  deleteAboutReducer,
  uploadImagesReducer,
  userLoginReducer,
  userRegisterReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
