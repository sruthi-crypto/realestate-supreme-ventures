import sliceCreator from "..";

const slice = sliceCreator<{ phone: string; password: string; location?: string }, any>(
	"userRegisterAction",
	"user-auth/register",
	"post"
);

const { reducer: userRegisterReducer, asyncAction: userRegisterAction, clearData: clearUserRegisterAction } = slice;
export { userRegisterAction, clearUserRegisterAction };
export default userRegisterReducer;
