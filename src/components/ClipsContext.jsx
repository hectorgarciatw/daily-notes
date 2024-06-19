// src/context/ClipsContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const ClipsContext = createContext();

export const ClipsProvider = ({ children }) => {
    const [clips, setClips] = useState([]);

    return <ClipsContext.Provider value={{ clips, setClips }}>{children}</ClipsContext.Provider>;
};

export const useClips = () => {
    return useContext(ClipsContext);
};
