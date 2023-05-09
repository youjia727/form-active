import { createContext } from "react";
/* 创建上下文 */

type propObj = {
    [key: string]: any
}

export const StateContext = createContext<propObj | null>(null);