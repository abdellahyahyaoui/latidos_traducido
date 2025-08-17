import React from "react";
import { useLanguage } from "../contexts/LanguageContext"
import "./Firma.css";

export default function Firma() {
  const { t } = useLanguage();

  return <p className="firma">{t("minombre")}</p>;
}
