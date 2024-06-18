import React, { createContext, useState, useContext } from "react";

const ClipsContext = createContext();

export const ClipsProvider = ({ children }) => {
    const [clips, setClips] = useState([]);

    const updateClips = (newClips) => {
        setClips(newClips);
    };

    return <ClipsContext.Provider value={{ clips, updateClips }}>{children}</ClipsContext.Provider>;
};

export const useClips = () => useContext(ClipsContext);
