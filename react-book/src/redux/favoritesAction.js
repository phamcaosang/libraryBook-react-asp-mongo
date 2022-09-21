// import localStorageService from "../localStorage.service";
import { userRequest } from "../requestMethods";
import { addBookToFavorites, removeBookFromFavorites, setBookFavorites } from "./favoritesSlicer";

export const SetFavoriteBooks = (dispatch, values) => {
    dispatch(setBookFavorites(values));
};


export const AddFavoriteBook = async (dispatch, userId, bookId, onFail, onSuccessAdd) =>{
    await userRequest.post("User/favorites/add/" + userId, {"id": bookId}).then((res)=>{
        dispatch(addBookToFavorites(bookId))
        onSuccessAdd()
    }
    ).catch((err) =>{
        console.log(err)
        onFail(err)
    })
}

export const RemoveFavoriteBook = async (dispatch, userId, bookId, onFail, onSuccessRemove) =>{
    console.log("User/favorites/delete/" + userId)
    await userRequest.post("User/favorites/delete/" + userId, {"id": bookId}).then((res)=>{
        dispatch(removeBookFromFavorites(bookId))
        onSuccessRemove()
    }
    ).catch((err) =>{
        console.log(err)
        onFail(err)
    })
}