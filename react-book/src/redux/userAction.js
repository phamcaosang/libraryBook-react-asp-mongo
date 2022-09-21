import { clearFavorites } from "./favoritesSlicer";
import { setUserInfor, logOutUser } from "./userSlicer";

export const setUserAction = (dispatch, values) => {
    try{
        dispatch(setUserInfor(values));
        localStorage.setItem("Token", values.Token)
    }catch(err){
        console.log(err)
    }
};

export const logOutUserAction = (dispatch) => {
    dispatch(logOutUser());
    dispatch(clearFavorites());
    localStorage.removeItem("Token")
};