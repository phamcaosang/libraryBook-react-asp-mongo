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
    try{
        dispatch(logOutUser());
        localStorage.removeItem("Token")
    }catch(err){
        console.log(err)
    }
};