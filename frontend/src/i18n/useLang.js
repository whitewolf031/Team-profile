import { useState, useCallback } from "react";
import translations from "./translations";

export function useLang() {
    const [lang, setLang] = useState(
        localStorage.getItem("lang") || "uz"
    );

    const changeLang = useCallback((newLang) => {
        setLang(newLang);
        localStorage.setItem("lang", newLang);
    }, []);

    const t = useCallback(
        (key) => translations[lang]?.[key] || key,
        [lang]
    );

    return { lang, changeLang, t };
}