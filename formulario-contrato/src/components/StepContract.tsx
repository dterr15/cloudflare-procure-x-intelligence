import { useState } from "react";
import { Textarea } from "./Textarea"; // Solo necesitamos Textarea para terminosEspeciales
// Se eliminaron Input y Select de los imports si ya no se usan en este archivo
import { Select } from "./Select"; // Mantener Select para tipoContrato
import type { ContractInfo } from "@/types";

const TIPOS_CONTRATO = [
  { value: "Starter", label: "Starter" },
  { value: "Basic", label: "Basic" },
  { value: "Pro", label: "Pro" },
];

// ❌ Se eliminó const MONEDAS

interface StepContractProps {
  data: Partial<ContractInfo>;
  onChange: (data: Partial<ContractInfo>) => void;
  errors: Record<string, string>;
}

export function StepContract({ data, onChange, errors }: StepContractProps) {
  const [localData, setLocalData] = useState<Partial<ContractInfo>>(data);

  const handleChange = <K extends keyof ContractInfo>(field: K, value: any) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  // ❌ Se eliminó lógica de Monto y Fecha

  return (
    <div className="form-step">
      <h2 className="step-title">Información del Contrato</h2>
      <p className="step-description">
        Selecciona el tipo de contrato que deseas generar.
      </p>

      <Select
        label="Tipo de Contrato"
        name="tipoContrato"
        value={localData.tipoContrato || ""}
        onChange={(value) => handleChange("tipoContrato", value as ContractInfo["tipoContrato"])}
        error={errors.tipoContrato}
        options={TIPOS_CONTRATO}
        required
        placeholder="Selecciona el tipo de contrato"
        helpText="Determina la base legal del acuerdo."
      />

      {/* ❌ Se eliminaron los bloques de Moneda, Duración y Descripción del Servicio */}

      <Textarea
        label="Términos Especiales (opcional)"
        name="terminosEspeciales"
        value={localData.terminosEspeciales || ""}
        onChange={(value) => handleChange("terminosEspeciales", value)}
        error={errors.terminosEspeciales}
        rows={3}
        maxLength={2000}
        showCount
        placeholder="Condiciones particulares, cláusulas especiales, etc."
        helpText="Cualquier condición adicional que deba incluirse."
      />
    </div>
  );

}

