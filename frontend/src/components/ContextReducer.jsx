import React, { createContext, useContext, useReducer, useState } from 'react'

const cartStateContext = createContext()
const cartDispatchContext = createContext()
export const myContext=createContext()

const reducer = (state, action) => {

    switch (action.type) {
        case "ADD":
            return [...state, { id: action.id, name: action.name, qty: action.qty, size: action.size, price: action.price, img: action.img }]

        case "REMOVE":
            let newArr = [...state]
            newArr.splice(action.index, 1)
            return newArr

        case "UPDATE":
            let arr = [...state]
            arr.find((food, index) => {
                if (food.id === action.id) {
                    console.log(food.qty, parseInt(action.qty), action.price * food.price);
                    arr[index] = { ...food, qty: parseInt(action.qty) * food.qty, price: action.price + food.price }
                }
                return arr
            })
            return arr

            case "DROP":
                let emptyArr=[]
                return emptyArr

       
        default:
            console.log("error in Reducer");
    }
}

export const CartProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, [])
    const [items, setItems] = useState([])
    const [category, setCategory] = useState([])
    const [filtered,setFiltered]=useState(items)  
    const [data, setData] = useState([])
    // const [loggeduser,setLoggedUsers]=useState([])
    const [loguser,setLoguser]=useState(null)
    const values={
      items, setItems,category, setCategory,filtered,setFiltered,data, setData,loguser,setLoguser
    }

    return (
        <myContext.Provider value={values}>
        <cartDispatchContext.Provider value={dispatch}>
            <cartStateContext.Provider value={state}>
                {children}
            </cartStateContext.Provider>
        </cartDispatchContext.Provider>
        </myContext.Provider>

    )
}


export const useCart = () => useContext(cartStateContext)
export const useDispatchCart = () => useContext(cartDispatchContext)

