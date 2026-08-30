import sliceCreator from "..";

const slice = sliceCreator<{ phone: string; password: string }, any>(
	"userLoginAction",
	"user-auth/login",
	"post"
);

const { reducer: userLoginReducer, asyncAction: userLoginAction, clearData: clearUserLoginAction } = slice;
export { userLoginAction, clearUserLoginAction };
export default userLoginReducer;
