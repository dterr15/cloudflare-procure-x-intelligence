import React, { useState } from "react";
import { Input } from "./Input";
import type { CompanyInfo } from "@/types";
import { formatRut } from "@/utils/security";

interface StepCompanyProps {
  data: Partial<CompanyInfo>;
  onChange: (data: Partial<CompanyInfo>) => void;
  errors: Record<string, string>;
}

export function StepCompany({ data, onChange, errors }: StepCompanyProps) {
  const [localData, setLocalData] = useState<Partial<CompanyInfo>>(data);

  const handleChange = <K extends keyof CompanyInfo>(field: K, value: CompanyInfo[K]) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const handleRutChange = (value: string) => {
    const formatted = formatRut(value);
    handleChange("rutEmpresa", formatted);
  };

  return (
    <div className="form-step">
      <h2 className="step-title">Información de la Empresa</h2>
      <p className="step-description">
        Datos de la empresa u organización que firmará el contrato.
      </p>

      <Input
        label="Razón Social"
        name="razonSocial"
        value={localData.razonSocial || ""}
        onChange={(value) => handleChange("razonSocial", value)}
        error={errors.razonSocial}
        required
        skipInputSanitization={true}
        autoComplete="organization"
        placeholder="Ej: Empresa S.A."
      />

      <div className="form-grid">
        <Input
          label="RUT Empresa"
          name="rutEmpresa"
          value={localData.rutEmpresa || ""}
          onChange={handleRutChange}
          error={errors.rutEmpresa}
          required
          placeholder="76.123.456-7"
          helpText="RUT de la empresa"
        />

        <Input
          label="Giro Comercial"
          name="giro"
          value={localData.giro || ""}
          onChange={(value) => handleChange("giro", value)}
          error={errors.giro}
          required
          skipInputSanitization={true}
          placeholder="Ej: Servicios de consultoría"
        />
      </div>

      <Input
        label="Dirección de la Empresa"
        name="direccionEmpresa"
        value={localData.direccionEmpresa || ""}
        onChange={(value) => handleChange("direccionEmpresa", value)}
        error={errors.direccionEmpresa}
        required
        skipInputSanitization={true}
        placeholder="Dirección completa de la empresa"
      />

      <Input
        label="Ciudad"
        name="ciudadEmpresa"
        value={localData.ciudadEmpresa || ""}
        onChange={(value) => handleChange("ciudadEmpresa", value)}
        error={errors.ciudadEmpresa}
        required
        skipInputSanitization={true}
        placeholder="Ciudad donde opera la empresa"
      />

      <div className="divider">
        <span>Representante Legal</span>
      </div>

      <div className="form-grid">
        <Input
          label="Nombre del Representante Legal"
          name="representanteLegal"
          value={localData.representanteLegal || ""}
          onChange={(value) => handleChange("representanteLegal", value)}
          error={errors.representanteLegal}
          required
          skipInputSanitization={true}
          placeholder="Nombre completo"
          helpText="Quien firma en representación de la empresa"
        />

        <Input
          label="Cargo"
          name="cargoRepresentante"
          value={localData.cargoRepresentante || ""}
          onChange={(value) => handleChange("cargoRepresentante", value)}
          error={errors.cargoRepresentante}
          required
          skipInputSanitization={true}
          placeholder="Ej: Gerente General"
        />
      </div>
    </div>
  );
}