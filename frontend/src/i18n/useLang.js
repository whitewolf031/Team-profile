import { useState, useCallback } from "react";
import translations from "./translations"

export function useLang() {
    const [lang, setLang] = useState(
        () => localStorage.getItem("lang") || "uz"
    );

    const changeLang = useCallback((l) => {
        setLang(l);
        localStorage.setItem("lang", l);
    }, []);

    const t = useCallback(
        (key) => translations[lang]?.[key] || translations.uz[key] || key,
        [lang]
    );

    return { lang, changeLang, t };
}